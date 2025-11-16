---
title: [Linux] Configurando compactação de memória
description: Aprenda a aproveitar o poder de processamento do seu PC para aumentar a capacidade de RAM do seu sistema!
date: 18:40 - 28/11/2022
---

Olá, essa é minha primeira postagem aqui no TabNews e gostaria de ensinar aos usuários de linux iniciantes como podem "reduzir" o consumo de memória, compactando os dados usando uma função que já vem diretamente no núcleo do sistema.

Esté tutorial foi testado no Debian 11(Bullseye), e provavelmente vai funcionar em qualquer distro baseada nele(Ubuntu e seus derivados por exemplo), vamos começar :)

Primeiramente é preciso instalar o pacote `zram-tools` então rode o seguinte comando no seu terminal:

```bash
sudo apt update
sudo apt install zram-tools
```

Agora temos que configurar qual o algoritmo que vai ser usado para  compactar os dados e quantos MB de dados vão poder ser compactados, pra isso temos que editar o arquivo `/etc/default/zramswap` e definir os valores a seguir:

  - `ALGO` - Algoritmo a ser usado
  - `SIZE` - Tamanho máximo dos dados compactados

Como algoritmos para escolher temos por ordem de compactação:

zstd > lzo > lz4

E por ordem de velocidade:

lz4 > zstd > lzo

Portando aqui vamos usar o algoritmo zstd que une o melhor dos dois mundos, então temos que colocar as chaves e valores no arquivo da seguinte forma:

```text
ALGO=zstd
SIZE=2048  # Escolhi um tamanho de 2GB
```

Agora é só reiniciar o sistema e aproveitar!

Para verificar o uso da zram você pode usar o comando:

```bash
zramctl
```

Obrigado por ler e ate a próxima!!

Links que podem ser úteis:

  - [ZRam Debian wiki](https://wiki.debian.org/ZRam)
  - [ZRam linux documentation](https://www.kernel.org/doc/html/latest/admin-guide/blockdev/zram.html)