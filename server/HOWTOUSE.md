Sebelum menjalan apps pindah ke folder server dan lakukan setp-step command dibawah ini 

- npm i
- npx seqeulize-cli db:create
- npx seqeulize-cli db:migrate:all
- npx seqeulize-cli db:seed
- node --watch app.js

Lalu buat terminal baru dan pindahkah ke folder client

- npm i
- npm run dev