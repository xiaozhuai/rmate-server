# rmate-server

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

If you want auto create a tunnel whenever you connect to a ssh server, put this into `~/.ssh/config`
```
Host *
RemoteForward 52698 localhost:52698
```

And for secure reason, listen loopback interface(127.0.0.1) is better than listen '0.0.0.0'.

**Never run `rmate-server` as root user unless you know what you are doing.**

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