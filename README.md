¡Hola! Bienvenido(a) a Mini Red Social, una pequeña aplicación de chat y microblogging donde puedes:

- Crear un post con tu nombre, mensaje y contraseña.

- Dar "me gusta" ❤️ o "no me gusta" 💔 a cada publicación (solo una interacción por IP, y puedes cambiar de like a dislike).

- Eliminar tus propios posts ingresando la contraseña que usaste al publicarlo.

- Navegar cómodamente entre el formulario de creación y la lista de posts.


Requisitos

- Node.js (versión 14 o superior)

- npm (v6+) o yarn

Estructura de Proyecto

mini-red-social/
├── data/
│   ├── posts.json      # Almacena todas las publicaciones
│   └── users.json      # Almacena usuarios y contraseñas hasheadas
├── public/             # Archivos públicos (frontend)
│   ├── index.html      # Página principal
│   ├── style.css       # Estilos responsivos y theme dark
│   ├── script.js       # Lógica de interacción (fetch, likes, delete)
│   └── menu-toggle.js  # Control del menú hamburguesa en móvil
├── server.js           # Servidor Express con endpoints CRUD
├── package.json        # Dependencias y scripts
└── README.md           # Este archivo



Instalación & arranque

Clona el repositorio y accede a la carpeta:

git clone https://github.com/ferlodev01/mini-red-social.git
cd mini-red-social

Instala dependencias:

npm install
# o con Yarn:
# yarn install

Ejecuta en modo desarrollo (con recarga automática):

npm run dev
# o directamente: nodemon server.js

Abre en tu navegador: http://localhost:3000


Notas y recomendaciones

Las contraseñas se guardan hasheadas en data/users.json.

El endpoint POST /clear borra todo el historial (no expuesto en UI).

Para ajustes de configuración (puerto, etc.), utiliza variables de entorno (process.env).



IMPORTANTE: CREAR CARPETA data CON ARCHIVOS post-json [] Y users.json {}
 
