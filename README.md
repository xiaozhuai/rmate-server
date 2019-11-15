# rmate-server

[中文说明](README_CN.md)

A server that implements the Textmate's 'rmate' feature for any editors.

## Installation

1. Download the `rmate-server` from releases page to local machine
2. Choose a rmate version and download to remote server
    * Ruby version: [https://github.com/textmate/rmate](https://github.com/textmate/rmate)
    * Bash version: [https://github.com/aurora/rmate](https://github.com/aurora/rmate)
    * Perl version: [https://github.com/davidolrik/rmate-perl](https://github.com/davidolrik/rmate-perl)
    * Python version: [https://github.com/sclukey/rmate-python](https://github.com/sclukey/rmate-python)
    * Nim version: [https://github.com/aurora/rmate-nim](https://github.com/aurora/rmate-nim)
    * C version: [https://github.com/hanklords/rmate.c](https://github.com/hanklords/rmate.c)
    * Node.js version: [https://github.com/jrnewell/jmate](https://github.com/jrnewell/jmate)
    * Golang version: [https://github.com/mattn/gomate](https://github.com/mattn/gomate)
    
## Usage

1. Write a config file named `config.json`
2. Start with command line `rmate-server -c config`
3. Create an ssh tunnel `ssh -R 52698:127.0.0.1:52698 user@example.org`
4. On your remote system run `rmate -w file`

## Tips

1. If you want auto create a tunnel whenever you connect to a ssh server, put this into `~/.ssh/config`
    ```
    Host *
    RemoteForward 52698 localhost:52698
    ```

2. For secure reason, `rmate-server` listen loopback interface '127.0.0.1' as default rather than '0.0.0.0'.

3. In WSL(Windows Subsystem Linux) environment, you need run `rmate-server` on windows, and there is no need to create a tunnel.

4. For docker, I'am pretty sure there is a way, I didn't try it yet, if somebody has an experience, please make a pr.

5. **Never run `rmate-server` as root user unless you know what you are doing.**

## Config Examples

rmate-server can spawn many editor(almost any) your like, here is some examples, choose one as you favorite.

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