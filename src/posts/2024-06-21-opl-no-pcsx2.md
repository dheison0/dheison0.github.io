---
title: [Linux] Instalação do OPL no PCSX2
description: Nesta pequena postagem irei ensina-lo a instalar nosso querido OPL no PCSX2 para fins de testes e desenvolvimento.
date: 08:21 - 21/06/2024
---

Olá! Esses dias estava precisando de uma forma de emular o Play Station 2 no meu sistema Linux para poder dar continuidade no desenvolvimento do [PS2 Game Manager](https://github.com/dheison0/ps2-game-manager), acabei encontrando um tutorial no YouTube mas não era tão bom assim e os links não funcionam, então resolvi fazer um também porem acabei descobrindo que sou péssimo nisso além de não ter equipamento adequado, dai tirei a ideia de escrever um artigo aqui no TabNews, espero que gostem!

## Passos

- [Passos](#passos)
- [Instalar o PCSX2](#instalar-o-pcsx2)
- [Baixar o USBQemu Whell](#baixar-o-usbqemu-whell)
- [Criar e formatar um disco virtual](#criar-e-formatar-um-disco-virtual)
- [Configurar o USBQemu Whell](#configurar-o-usbqemu-whell)
- [Formatar os cartões de memória e testar o OPL](#formatar-os-cartões-de-memória-e-testar-o-opl)

## Instalar o PCSX2


\[Obs: Isto não é para todos os sistemas\] No Debian 12 é preciso fazer a ativação do suporte a 32bits caso seu sistema seja de 64bit, para isso rode os seguintes comandos:

```bash
sudo dpkg --add-architecture i386
sudo apt update
```

Com isso você já tem os repositórios com suporte a 32bit e agora pode instalar o PCSX2, rode o comando:

```bash
sudo apt install pcsx2
```

Só aguardar!

## Baixar o USBQemu Whell

Para fazer o download você deve visitar a [página de lançamentos](https://github.com/jackun/USBqemu-wheel/releases) no Github e baixar a versão mais nova suportado pelo seu sistema, no meu caso é a `0.10.0` e na versão do Debian, existe uma para Ubuntu caso seu sistema seja baseado nele, depois disso instale o pacote usando o APT:

```bash
sudo apt install ~/Downloads/libusbqemu*.deb
```

## Criar e formatar um disco virtual

Escolhe o local onde deseja criar um arquivo que conterá os jogos e crie-o com o tamanho do disco desejado, eu uso o `fallocate` para isso, um exemplo:

```bash
# Cria um arquivo de 32GB
fallocate -l 32G usb.img
```

Com o arquivo criado agora é preciso formata-lo usando o tipo de partição FAT, use o seguinte comando:

```bash
mkfs.fat usb.img
```

Esse comando vai rodar rapidamente e seu disco já estará pronto para ser montado, eu uso o comando `mount` para isso já que o Gnome Disks sempre monta os discos que crio manualmente no modo somante leitura, um exemplo de montagem:

```bash
mkdir ps2
# Monta o arquivo usb.img na pasta ps2
mount -o loop usb.img ps2
```

Agora é só instalar seus jogos(vai precisar rodar o instalador como root) e desmontar o disco para prosseguir

## Configurar o USBQemu Whell

Daqui em diante as configurações serão feitas usando o emulador, então vamos abri-lo e clicar em "Next" até chegar na página de configuração dos plugins, onde você deverá selecionar o `Qemu USB Driver` na opção `USB` para que possamos emular o disco virtual

![Janela de configuração inicial mostrando as opções de plugins](https://i.imgur.com/cWGuW8d.png)

Depois de selecionado, clique em "Configure" ao lado da escolha de plugin USB e em Player 1 e 2 na sessão "Select Device Type" selecione "Mass Storage Device" em ambos os players, em seguida no "Select Device API" ao lado do "Player 1" clique em "Configure" e "Browser" na janela que aparecer, agora procure e escolha o arquivo de armazenamento virtual que foi criado anteriormente

![Janela de configuração do Qemu USB Driver](https://i.imgur.com/38U7QRK.png)

Confirme as duas janelas clicando em "OK" e prossiga com a configuração normal do PCSX2

## Formatar os cartões de memória e testar o OPL

Depois de tudo feito basta apenas configurar os controles e formatar os cartões de memória do emulador, para isso desative o CD/DVD indo em "CDVD > No Disk", inicialize a BIOS e faça a configuração normalmente, on final vá em "Browser" e formate os dois cartões de memória, pronto, agora é só rodar o OPL

Baseado nos meus testes, o OPL 1.10 não funciona o dispositivo de disco USB emulado do PCSX2 então vamos usar a 1.20(beta no momento) ou inferior a 1.10, entre na [página de lançamentos do OPL](https://github.com/ps2homebrew/Open-PS2-Loader/releases) e escolha a versão que desejar, em seguida descompacte o arquivo ELF do programa e no PCSX2 vá em "System > Run ELF" para dar boot usando o arquivo do OPL, configure-o da forma que desejar e é só correr pro abraço, a instalação está concluida!

![OPL rodando no emulador com o jogo "7 Wonders of the Ancient World" instado e com capa](https://i.imgur.com/xvoTdBV.png)

Obrigado por ter lido até aqui, espero ter ajudado e ate a próxima!