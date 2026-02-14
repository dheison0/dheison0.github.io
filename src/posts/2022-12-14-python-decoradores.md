---
title: Decoradores em Python
description: Aprenda a utilizar uma das funcionalidades mais úteis do python para embrulho de funções.
date: 16:46 - 14/12/2022
---

Olá pessoal, ontem tive um pequeno problema na hora de usar cache em memória no [Sanic](https://sanic.dev) pra aumentar a velocidade de respostas da minha API, eu não estava conseguindo encontrar material na internet em geral e nem na documentação sobre como fazer isso, então resolvi criar minha própria implementação, e isso me trouxe a fazer a postagem de hoje, espero que gostem.

## O que é um decorador?

Em poucas palavras: Um decorador é uma função que "embrulha" outra função na hora de sua definição.

Isto é útil para filtragem de dados de entrada e outras coisas(no meu caso foi armazenamento de um retorno da função para ser usado posteriormente).

Um exemplo de uso é em bots do Telegram, você pode criar um decorador que só permite a execução de um comando caso quem tenha enviado seja um administrador.


## Criando um decorador

A criação de decoradores em python é bem fácil, existem dois tipos de decoradores possiveis de serem criados, o mais simples apenas marca uma função e executa um código estático nela, o segundo pode receber argumentos e assim fazer mais decisões sobre o que deve ou não ser feito, aqui eu vou ensinar as duas formas para que não gastem processamento atoa :)

### Decorador simples

O decorador simples é apenas uma closure com uma função de resposta marcada como "embrulho", a definição é dada usando uma função normal que recebe a função desenvolvida pelo usúario como argumento e dentro dessa função principal é definida outra usando o decorador que marca ela como "embrulho", logo depois essa função marcada é devolvida como resposta da função principal, veja um exemplo:

```python
# Esse é o decorador padrão que marca como "embrulho"
from functools import wraps

def meu_decorador(func):
    @wraps(func)
    def embrulho(*args, **kwargs):
        print("Essa função foi embrulhada com o decorador simples")
        # Você também pode salvar o retorno da função e fazer o que quiser com ele
        return func(*args, **kwargs)
    return embrulho
```

Para usar esse tipo de decorador você não pode chamá-lo, apenas marcar, se chamá-lo ira ocorrer um erro por falta do argumento `func` e não ira funcionar!

Veja um exemplo de uso:

```python
@meu_decorador
def ola():
    print("Olá, Mundo!")

ola()
```

A execução desse código vai resultar na seguinte saida no terminal:

```plain
Essa função foi embrulhada com o decorador simples
Olá, Mundo!
```

Caso ainda duvide de ocorrer um erro se chamar o decorador é só você mesmo testar por ai, use `@meu_decorador()` no lugar de `@meu_decorador`.

Obs: Se você definir o parâmetro `func` manualmente é possivel usar o decorador como closure normal, mas isso é meio inútil.


### Decorador que aceita argumentos

Agora chegamos no decorador legal, esse tem mais utilidade que o anterior por poder receber argumentos que ajudam nas decisões.

O jeito de fazer esse é praticamente o mesmo, mas você cria uma função que contem o decorador simples e retorna ele como resposta, nessa função você pode definir parâmetros para receber os argumentos. Ao cotrário da anterior, nessa versão você não recebe a função desenvolvida na principal, apenas no decorador que vai ser retornado.

Veja um exemplo de como esse é desenvolvido:

```python
from functools import wraps
from time import sleep

def demora(n: int):
    def decorador(func):
        primeira_execucao: bool = True
        @wraps(func)
        def embrulho(*args, **kwargs):
            nonlocal primeira_execucao
            print("Essa função foi embrulhada pelo decorador que recebe argumentos")
            if primeira_execucao:
                print(f"Esperando {n} segundos para que a função seja executada pela primeira vez")
                sleep(n)
                primeira_execucao = False
            return func(*args, **kwargs)
        return embrulho
    return decorador
```

Aqui nós recebemos um argumento `n` que diz o tempo demorado para a primeira execução da função, e guardamos a informação de se é a primeira execução em uma variável no escopo do decorador que é usada dentro do embrulho, mas para que essa variável seja manipulada é preciso o uso da palavra chave `nonlocal` já que a variável não é local e nem global, ela esta um escopo acima de onde esta sendo usada. Um detalhe é que qualquer informação que deseje ser permanente deve estar no escopo do decorador, e não no do embrulho.

Agora caso você use esse decorador em uma função, ela ira demorar `n` segundos para ser executada pela primeira vez e nas posteriores ira executar de imediato, veja mais esse exemplo:

```python
@demora(2)
def ola2(nome: str):
    print(f"Olá, {nome}!")

ola2("João")
ola2("Maria")
```

Esse código ira resultar na seguinte saída:

```plain
Essa função foi embrulhada pelo decorador que recebe argumentos
Esperando 2 segundos para que a função seja executada pela primeira vez
Olá, João!
Essa função foi embrulhada pelo decorador que recebe argumentos
Olá, Maria!
```

Veja que na segunda execução ele já não tem mais a demora de 2 segundos que na primeira vez, isso é porque guardamos a informação de que era primeira execução em uma variável no escopo do decorador, que não é executado toda vez que a função é chamada, apenas em sua criação.

É isso! Espero que tenham gostado e obrigado por ler ate aqui ;)
