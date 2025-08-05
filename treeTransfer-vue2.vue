<template>
  <div class="tree-container">
    <div class="tree-panel left">
      <div class="panel-header">
        <div class="panel-title">
          <span>{{ leftConfig.title }}</span>
        </div>
        <div class="count-wrap">
          (
          <span class="count">{{ leftCheckedNum }}</span>
          /
          <span class="count">{{ leftTotalNum }}</span>
          )
        </div>
      </div>
      <div class="panel-content">
        <kui-input
          v-model="leftFilterValue"
          placeholder="$t[input.pls_input]"
          class="filter-input"
          width="100%"
          @change="leftFilter"
        ></kui-input>
        <kui-tree
          ref="leftTree"
          :data="leftTree"
          :value-key="idsKey"
          :label-key="nameKey"
          :children-key="childrenKey"
          :expand="leftConfig.expand"
          :multiple="leftConfig.multiple"
          @check="leftCheckHandle"
          @check-change="leftCheckChange"
        ></kui-tree>
      </div>
    </div>
    <div class="handle-box">
      <kui-button
        icon="kui-icon-arrow-right"
        :type="null"
        @click="handleTransfer('add')"
      ></kui-button>
      <span style="height: 10px; width: 100%"></span>
      <kui-button
        icon="kui-icon-arrow-left"
        :type="null"
        @click="handleTransfer('remove')"
      ></kui-button>
    </div>
    <div class="tree-panel right">
      <div class="panel-header">
        <div class="panel-title">
          <span>{{ rightConfig.title }}</span>
        </div>
        <div class="count-wrap">
          <span class="count">({{ rightTotalNum }})</span>
        </div>
      </div>
      <div class="panel-content">
        <kui-input
          v-model="rightFilterValue"
          placeholder="$t[input.pls_input]"
          class="filter-input"
          width="100%"
          @change="rightFilter"
        ></kui-input>
        <kui-tree
          ref="rightTree"
          :data="rightTree"
          :value-key="idsKey"
          :label-key="nameKey"
          :children-key="childrenKey"
          :expand="rightConfig.expand"
          :multiple="rightConfig.multiple"
        ></kui-tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'treeTransfer',
  props: {
    idKey: {
      type: String,
      default: 'id'
    },
    idsKey: {
      type: String,
      default: 'ids'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    parentKey: {
      type: String,
      default: 'parentId'
    },
    childrenKey: {
      type: String,
      default: 'children'
    },
    leftConfig: {
      type: Object,
      default: () => {
        return {
          title: 'Left Title',
          isTreeData: true,
          multiple: true,
          expand: true
        };
      }
    },
    rightConfig: {
      type: Object,
      default: () => {
        return {
          title: 'Selected',
          isTreeData: true,
          multiple: true,
          expand: true
        };
      }
    },
    leftData: {
      type: Array,
      default: () => []
    },
    rightData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      leftFilterValue: '',
      rightFilterValue: '',
      leftList: [],
      rightList: [],
      leftCheckedNum: 0
    };
  },
  computed: {
    leftTotalNum() {
      return this.leftList.filter((item) => item.isLeaf).length;
    },
    rightTotalNum() {
      return this.rightList.filter((item) => item.isLeaf).length;
    },
    rightValues() {
      return this.rightList.map((item) => item[this.idsKey]);
    },
    rightLeafValues() {
      return this.rightList.filter((item) => item.isLeaf).map((item) => item[this.idsKey]);
    },
    leftTree() {
      return this.flatToTree(this.leftList);
    },
    rightTree() {
      return this.flatToTree(this.rightList);
    }
  },
  watch: {
    leftData(val) {
      this.updateLeftList();
    },
    rgithData(val) {
      this.updateRightList();
    },
    leftTree() {
      this.updateLeftChecked();
    },
    rightTree() {
      this.updateLeftChecked();
    }
  },
  mounted() {
    this.updateLeftList();
    this.updateRightList();
  },
  methods: {
    updateLeftList() {
      this.leftList = this.leftConfig.isTreeData
        ? this.repeatTreeToFlat(this.leftData)
        : [...this.leftData];
    },
    updateRightList() {
      this.rightList = this.rightConfig.isTreeData
        ? this.repeatTreeToFlat(this.rightData)
        : [...this.rightData];
    },
    leftFilter() {
      this.$refs.leftTree.filter(this.leftFilterValue);
    },
    rightFilter() {
      this.$refs.rightTree.filter(this.rightFilterValue);
    },
    updateLeftChecked() {
      this.$nextTick(() => {
        const leftValues = this.leftList.map((item) => item[this.idsKey]);
        const needCheckedValues = this.rightLeafValues.filter((key) => leftValues.includes(key));
        this.$refs.leftTree.setCheckedKeys(needCheckedValues);
        this.updateLeftDisabled();
        this.updateLeftCheckedNum();
      });
    },
    updateLeftDisabled() {
      this.$nextTick(() => {
        const checkedNodes = this.$refs.leftTree.getCheckedNodes();
        checkedNodes.forEach((item) => {
          item.disabled = true;
        });
      });
    },
    handleTransfer(type) {
      this.rightFilterValue = '';
      const checkedNodes = this.$refs.leftTree.getCheckedNodes(false, true);
      checkedNodes.forEach((item) => {
        item.disabled = false;
      });
      if (type === 'add') {
        this.handleAdd();
      } else if (type === 'remove') {
        this.handleRemove();
      }
    },
    handleAdd() {
      this.$nextTick(() => {
        const rightList = [...this.rightList];
        const checkedKeys = this.$refs.leftTree.getCheckedKeys(true, false);
        const checkedList = this.leftList.filter((item) => checkedKeys.includes(item[this.idsKey]));
        checkedList.forEach((item) => {
          if (!this.rightValues.includes(item[this.idsKey])) {
            const { isDisabled, ...rest } = item;
            rightList.push(rest);
          }
        });
        this.rightList = [...rightList];
      });
    },
    handleRemove() {
      this.$nextTick(() => {
        const checkedKeys = this.$refs.rightTree.getCheckedKeys();
        const rightList = [...this.rightList];
        checkedKeys.forEach((key) => {
          const index = rightList.findIndex((item) => item[this.idsKey] === key);
          if (index > -1) {
            rightList.splice(index, 1);
          }
        });
        this.rightList = [...rightList];
      });
    },
    leftCheckHandle() {
      this.updateLeftCheckedNum();
    },
    leftCheckChange() {
      this.updateLeftCheckedNum();
    },
    updateLeftCheckedNum() {
      this.$nextTick(() => {
        const checkedKeys = this.$refs.leftTree.getCheckedKeys(false, true);
        this.leftCheckedNum = checkedKeys.length;
      });
    },
    flatToTree(flatList, rootParentId = null) {
      const { idsKey, childrenKey, parentKey } = this;
      const map = {};
      const tree = [];

      // 创建节点映射表
      flatList.forEach((item) => {
        map[item[idsKey]] = { ...item, [childrenKey]: [] };
      });

      // 构建树结构
      flatList.forEach((item) => {
        const node = map[item[idsKey]];
        const parentId = item[parentKey];

        if (parentId === rootParentId || parentId === undefined) {
          tree.push(node);
        } else {
          const parent = map[parentId];
          if (parent) {
            parent[childrenKey].push(node);
          }
        }
      });

      return tree;
    },
    repeatTreeToFlat(treeData, parentIdsPath = null) {
      const { idKey, childrenKey, parentKey, idsKey } = this;

      let flatList = [];

      treeData.forEach((node) => {
        // 计算当前节点的 ids 路径
        const currentIds = parentIdsPath ? `${parentIdsPath}-${node[idKey]}` : String(node[idKey]);

        // 创建平铺节点
        const flatNode = {
          ...node,
          [idsKey]: currentIds,
          isLeaf: !(node[childrenKey] && node[childrenKey].length),
          [parentKey]: parentIdsPath // 设置为父节点的完整路径
        };

        // 移除子节点属性
        const children = flatNode[childrenKey];
        delete flatNode[childrenKey];

        flatList.push(flatNode);

        // 递归处理子节点，传递当前节点的完整路径
        if (children && children.length > 0) {
          const childFlat = this.repeatTreeToFlat(children, currentIds);
          flatList = flatList.concat(childFlat);
        }
      });

      return flatList;
    }
  }
};
</script>

<style lang="scss" scoped>
.tree-container {
  display: flex;
  background-color: #fff;
  .tree-panel {
    flex: 1;
    border: 1px solid #d4d7de;
    border-radius: 2px;
    .panel-header {
      display: flex;
      background-color: #e9e9ea;
      padding: 12px;
    }
    .panel-title {
      margin-right: 8px;
    }
    .panel-content {
      padding: 12px;
      .filter-input {
        margin-bottom: 12px;
      }
    }
  }
  .handle-box {
    width: 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;
  }
}
</style>
