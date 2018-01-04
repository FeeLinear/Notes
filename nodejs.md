安装nodejs软件后默认的全局安装目录为：用户所在盘:\Users\用户名\AppData\Roaming\npm\node_modules

二、如需更改全局安装目录（仅更改安装所在目录）：
则执行：npm config set prefix "D:\Program Files\nodejs\node_global" 以及 npm config set cache"D:\Program Files\nodejs\node_cache"语句；
此时会在“用户所在盘:\Users\用户名”用户目录下生成一个.npmrc的隐藏文件，文件内容为：
prefix=D:\Program Files\nodejs\node_global
cache=D:\Program Files\nodejs\node_cachel

三、如想使用npm命令安装模块（安装源来自淘宝镜像）则执行以下命令：
npm config set registry https://registry.npm.taobao.org   这样使用npm命令则直接从淘宝镜像下载  相当于cnpm；
此时用户目录下.npmrc的内容为：
prefix=D:\Program Files\nodejs\node_global
cache=D:\Program Files\nodejs\node_cachel
registry=https://registry.npm.taobao.org

四、安装在自己配置的全局目录下的模块，目前还不能直接调用，调用会提示：不是内部或外部命令；

必须重新配置用户环境变量跟系统环境变量为：
NODE_PATH：D:\Program Files\nodejs\node_global\node_modules
更改用户PATH：D:\Program Files\nodejs\node_global\

五、若想测试所有配置是否成功
1、全局安装express模块： npm install express –g   查看全局目录D:\Program Files\nodejs\node_global\node_modules下面是否生成express文件夹
2、打开D:\Program Files\nodejs下node.js出现命令窗口，输入：require(‘express’); 看是否报错；

Npm升级至最新版
npm install -g npm

npm install 包名 –save 安装到项目运行所依赖的位置即package.json下面的dependencies
npm install 包名 –save-dev 安装到开发环境所依赖的位置即package.json下面的devDependencies


六、gulp的配置
gulp可安装在局部目录，也可安装在全局目录，安装后会在对应的目录生成gulp文件跟gulp.cmd文件； 全局目录则可在任意文件夹调用gulp命令，局部目录则只能cd到该目录下才能调用；
gulp配置文件只能放在当前cd到的目录才能被读取，放在nodejs全局目录也不行；

七、nodejs模块调用规则
首先在当前cd目录下node_modules文件夹下查找是否存在该模块，若存在，则直接调用，若不存在，则到配置的全局node_modules目录下查找；
