---
title: Instalando os drivers Nvidia 390 no Debian Trixie
description: Fazendo a instalação de drivers legados no Debian 13 através do repositório do Debian Sid
date: 13:45 - 14/02/2026
---

Olá pessoal!

Esses últimos dias eu tive que trocar de interface Linux para uma melhor comodidade - pra não dizer distro hopping - e um dos problemas que sempre enfrento é a necessidade de instalar os drivers antigos da Nvidia já que minha placa de vídeo é uma antiga GT 610 que usa a arquitetura Fermi.

Pesquisando sobre como eu poderia fazer isso no Debian, eu descobri que existe uma versão do driver disponível para a versão de testes e outra pra versão antiga do sistema, dai eu pensei:
> _E se eu colocar o repositório do Sid no sistemas mas não permitir a atualização dos pacotes usando ele?_

E deu muito certo, estou escrevendo essa postagem através do Debian 13 Cinnamon usando os drivers legados da Nvidia, então vamos ao que importa: Ensina-los a como fazer isso.

## Adicionando o repositório do Sid

Nos precisamos criar um arquivo chamado `/etc/apt/sources.list.d/sid.list` para que o `apt` reconheça, o repositório, nesse arquivo nos teremos o seguinte conteúdo:

```text
deb http://deb.debian.org/debian/ sid contrib non-free
```

Com isso nós já temos os pacotes de teste do Debian, mas antes de qualquer coisa, precisamos bloquear a possibilidade desses pacotes serem instalados encima dos estáveis, então criamos um arquivo `/etc/apt/preferences.d/99-pin-unstable` com a configuração a seguir:


```yaml
Package: *
Pin: release a=unstable
Pin-Priority: 99
```

Em que:
  - `Package` Define os pacotes("\*" quer dizer todos)
  - `Pin` Diz qual repositório("unstable" é o do "sid")
  - `Pin-Priority` É a prioridade dessa regra(maior = mais relevante)


Agora podemos atualizar a lista de pacotes:

```bash
apt update
```

## Instalando os drivers

Agora faremos a instalação dos drivers e de um pacote que é necessário mas não vem nas dependências:

```bash
sudo apt install \
  nvidia-legacy-390xx-driver \
  nvidia-legacy-390xx-opencl-icd `# opcional` \
  linux-headers-$(uname -r)
```

Aqui nos estamos instalando os drivers dkms legados, suporte ao OpenCL e os cabeçalhos de desenvolvimento do kernel - que é justamento o que não é mencionado em alguns lugares, mas é preciso dele para conseguirmos usar o modulo dkms.

O uso do `uname -r` Aqui é para podermos instalar os cabeçalhos referentes ao kernel em uso no momento de instalação dos drivers, talvez quando ocorrer uma atualização você precise instalar uma versão mais nova dele novamente.

Após isso ser concluído basta reiniciarmos o sistema e está tudo pronto! Muito obrigado por visitar meu website e espero que tenha gostado, até mais!

