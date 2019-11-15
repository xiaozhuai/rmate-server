# rmate-server

一个实现了Textmate的rmate远程编辑功能的服务端, 几乎可以用于任何编辑器

## 安装

1. 从release页面下载对应系统版本的 `rmate-server` 到本地
2. 从下面选择一个rmate客户端, 下载到远程服务器
    * Ruby version: [https://github.com/textmate/rmate](https://github.com/textmate/rmate)
    * Bash version: [https://github.com/aurora/rmate](https://github.com/aurora/rmate)
    * Perl version: [https://github.com/davidolrik/rmate-perl](https://github.com/davidolrik/rmate-perl)
    * Python version: [https://github.com/sclukey/rmate-python](https://github.com/sclukey/rmate-python)
    * Nim version: [https://github.com/aurora/rmate-nim](https://github.com/aurora/rmate-nim)
    * C version: [https://github.com/hanklords/rmate.c](https://github.com/hanklords/rmate.c)
    * Node.js version: [https://github.com/jrnewell/jmate](https://github.com/jrnewell/jmate)
    * Golang version: [https://github.com/mattn/gomate](https://github.com/mattn/gomate)
    
## 用法

1. 编写一个 `config.json`
2. 开启本地服务 `rmate-server -c config`
3. 创建一个ssh隧道 `ssh -R 52698:127.0.0.1:52698 user@example.org`
4. 在远程服务器上执行 `rmate -w file`

## 技巧与说明

如果你想要在每次使用ssh连接到一个服务器时, 自动创建隧道, 可以将下面的配置写入`~/.ssh/config`
```
Host *
RemoteForward 52698 localhost:52698
```

出于安全考虑, 最好使`rmate-server`监听回环接口`127.0.0.1`而不是`0.0.0.0`

**永远不要使用root用户权限运行`rmate-server`, 除非你知道你在做什么**

## 配置示例

`rmate-server` 几乎可以和所有的编辑器配合工作, 选一个你喜欢的就好, 下面是部分流行编辑器的配置示例

### Visual Studio Code

```json
{
    "host": "127.0.0.1",
    "port": 52698,
    "editor": {
        "command": "code",
        "args": [
            "-w",
            "{{file}}"
        ]
    }
}
```

### Atom

```json
{
    "host": "127.0.0.1",
    "port": 52698,
    "editor": {
        "command": "atom",
        "args": [
            "-w",
            "{{file}}"
        ]
    }
}
```

### TextMat

```json
{
    "host": "127.0.0.1",
    "port": 52698,
    "editor": {
        "command": "mate",
        "args": [
            "-w",
            "{{file}}"
        ]
    }
}
```