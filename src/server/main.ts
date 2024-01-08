import express from "express"
const bodyParser = require('body-parser');
const path = require('node:path');
import prisma from "./utils/prisma";
import getSurvey from "./utils/getSurvey";
import checkContext from "./utils/checkContext";
import Graphql from "./pages/api/graphql/graphql"
import ViteExpress from "vite-express";
import { getCurrentUser } from "./utils/currentUser";

require('dotenv').config({path: path.join(__dirname, ".env")})

const app = express();

function checkPort() {
  if (process.env.PORT) return parseInt(process.env.PORT, 10);
  return 3000;
}

const port = checkPort();

// Conectar Apollo Server a Express en la ruta /api/graphql
(async()=>{
  await Graphql.start();
  Graphql.applyMiddleware({ app, path: '/api/graphql' });
})()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

// Ruta para crear un nuevo elemento
app.post('/api/message', async(req, res) => {
  const currentUser = await getCurrentUser(req.get("authorization"))

  if(!currentUser) return res.status(401).json({
    error: {
      message: "The token is not valid"
    }
  })

  const {message, phone} = req.body;

  try {
    let firtSurvey = await getSurvey(phone)

    var [survey, cont, reply] = await checkContext(firtSurvey, message)
    
    switch(String(survey.question)){
      case "1":
          reply ='¿Cómo puntuaría del 1 al 5(siendo el mayor) el *trato* recibido por el personal?'
          break;
      case "2":
          if(cont) await prisma.survey.update({
            where: {
              id: survey.id
            },
            data: {
              firstQuestion: message
            }
          })
          reply ='¿Cómo puntuaría del 1 al 5(siendo el mayor)  la *organización* del servicio oficial?'
          break
      case "3":
          if(cont) await prisma.survey.update({
            where: {
              id: survey.id
            },
            data: {
              secondQuestion: message
            }
          })
          reply ='¿Cómo puntuaría del 1 al 5(siendo el mayor) la *calidad* del servicio realizado en su vehículo?'
          break
      case "4":
          if(cont) await prisma.survey.update({
            where: {
              id: survey.id
            },
            data: {
              thirdQuestion: message
            }
          })
          reply ='¿Cómo puntuaría del 1 al 5(siendo el mayor) el servicio de Sebastiani en *general?*'
          break
      case "5":
          if(cont) await prisma.survey.update({
            where: {
              id: survey.id
            },
            data: {
              fourthQuestion: message
            }
          })
          reply ='¿Algún comentario o *observación* / *recomendación*  sobre su visita?'
          break
      case "6":
          if(cont) await prisma.survey.update({
            where: {
              id: survey.id
            },
            data: {
              fifthQuestion: message
            }
          })
          reply ='¿Qué aspectos *destacarías* sobre su visita?'
          break
      case "7":
          if(cont) await prisma.survey.update({
            where: {
              id: survey.id
            },
            data: {
              sixthQuestion: message
            }
          })
          reply ='¿Qué te parecio el *lavado*?'
          break
      case "8": 
          if(cont) await prisma.survey.update({
            where: {
              id: survey.id
            },
            data: {
              seventhQuestion: message
            }
          })
          reply = "Okey, terminamos la encuesta.\n Si tenés algo más por comentar, simplemente escribalo.\n Muchas gracias por su tiempo!!!"
          break
      }
  } catch (error) {
      console.log(error)
  }
    res.status(201).json({
      reply
    });
  })

// Iniciar el servidor
ViteExpress.listen(app, port, () =>
  console.log(`Servidor escuchando en el puerto ${port}`)
);