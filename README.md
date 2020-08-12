
# Proyecto del Sistema de Seguimiento de pacientes (frontend operador).

Proyecto frontend (angular) para los operadores de salud del MSPyBS.

## Introducción

Estas instrucciones permitirán levantar el proyecto frontend operador.

### Tecnologías

Las tecnologías utilizadas por el proyecto son:

```
Sistema Operativo: Centos 7. 
NodeJS v8
npm 3+
Typescript
```

### Instalar paquetes npm

Clonar el proyecto y dirigirse a la carpeta que posee el archivo package.json (Raíz del proyecto). Instale los paquetes npm descritos en package.json de la siguiente manera:

```shell
npm install
```

### Levantar en modo desarrollo

Una vez que se hayan terminado de instalar las dependencias, proceder a levantar el proyecto con el siguiente comando:

```shell
npm start
```

El comando `npm start` compila la aplicación y levanta el proyecto en el puerto 4200.

```shell
http://localhost:4200
```

Ciérrelo manualmente presionando las teclas `Ctrl-C`.

### Modo producción

El comando `npm run build` compila la aplicación y genera una carpeta **dist** en la raíz del proyecto. Dicha carpeta es la que debe ser deployada en algún servidor apache o nginx.

```shell
npm run build
```
