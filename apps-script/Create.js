// Add client to the sheets of OB - Fallidos
function addUser(form) {
  const id = createId(sheetsObFallidos);

  const name = returnNullValue(form.userName)
  const lastName = returnNullValue(form.userLastName)
  const phone = returnNullValue(form.userPhone)
  const dni = returnNullValue(form.userDni)
  const cod = returnNullValue(form.userCod)
  const referent = returnNullValue(form.userReferent)
  const dateOfFirstContact = currentDate()
  const statusWeb = returnNullValue(form.userStatusWeb)
  const country = returnNullValue(form.userCountry)
  const product = returnNullValue(form.userProduct)
  const statusRisk = returnNullValue(form.userStatusRisk)

  sheetsObFallidos.appendRow([
    id,
    country,
    name,
    lastName,
    phone,
    dni,
    cod,
    referent,
    dateOfFirstContact,
    statusWeb,
    product,
    statusRisk,
    "Call-Center"
  ]);

  let clientFolderImages = DriveApp.getFolderById("1afzW-Hw2-hZYD-DMZz2LQlL9w7HHWUE3")
  let subClientFolderImages = clientFolderImages.createFolder(`Cliente_tlf_${phone}`)
  const linkToFolder = `https://drive.google.com/drive/folders/${subClientFolderImages.getId()}`

  const fila = searchRow(id, sheetsObFallidos);
  sheetsObFallidos.getRange(fila, 27, 1, 1).setValues([[
    linkToFolder
  ]])

  return "User created"

}

// Create a nuevo ID para el usuario y poder mapearlo
function createId(sheets) {
  let id = 1;
  if (sheets.getLastRow() === 1) {
    return id
  }

  const ids = sheets.getRange(2, 1, sheets.getLastRow() - 1, 1).getValues().flat();

  let maxId = 0;

  ids.forEach(id => {
    if (id > maxId) {
      maxId = id;
    }
  });

  return maxId + 1
}

// Retorna un string con el valor de Null si el string esta vacio
function returnNullValue(value) {
  return value.length > 0 ? value : 'NULL'
}

// Devuelve la fecha actual
function currentDate() {

  const date = new Date()

  const month = date.getMonth() <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1

  const day = date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()

  return `${date.getFullYear()}-${month}-${day}`
}

// Devuelve la hora actual
function currentHour() {
  const date = new Date()

  const minutes = () => {

    if (date.getMinutes() <= 9) {
      return `0${date.getMinutes()}`;
    } else {
      return date.getMinutes();
    }
  }

  const hour = date.getHours()

  return `${hour}:${minutes()}`
}

// Funciones para las tipificaciones
// Añade la tipificacion que se regitro en el formulario en el sheets de Tipificaciones
function addComentsCall(form) {

  const id = createId(sheetsTipificaciones);
  const viaOfCall = returnNullValue(form.callViaOfCalling);
  const phoneClient = returnNullValue(form.clientPhone);
  const dateOfContact = returnNullValue(currentDate());
  const hourOfCall = returnNullValue(currentHour());
  const resultOfTheCall = returnNullValue(form.callResults);
  const comments = returnNullValue(form.callComentsOfCalling);
  const reasonToNotAfiliated = returnNullValue(form.callReasonToNotAfiliate);
  const agent = returnNullValue(form.callAgentName);
  const clientStatus = returnNullValue(form.callStatusClient);

  sheetsTipificaciones.appendRow([
    id,
    viaOfCall,
    phoneClient,
    dateOfContact,
    hourOfCall,
    resultOfTheCall,
    comments,
    clientStatus,
    reasonToNotAfiliated,
    agent
  ]);

  return "Added coments call"

}

// Funciones para la evaluacion de la linea de credito

function saveRequestToCredit(info) {
  const id = createId(sheetsSolicitudesCreditos);
  const phoneClient = returnNullValue(info.clientPhone);
  const dateOfContact = returnNullValue(currentDate());
  const hourOfCall = returnNullValue(currentHour());
  const agent = returnNullValue(info.callAgentName);
  const clientName = returnNullValue(info.clientName)
  const clientLastName = returnNullValue(info.clientLastName)
  const commentsToEval = returnNullValue(info.commentsToEval)
  const clientDni = info.clientDni === "" ? "NULL" : info.clientDni

  sheetsSolicitudesCreditos.appendRow([
    id,
    clientName,
    clientLastName,
    clientDni,
    phoneClient,
    dateOfContact,
    hourOfCall,
    agent,
    commentsToEval,
    "Call-Center"
  ]);

  return "Added request"
}

// Funciones para la respuesta de creditos

function saveResponseOfCredit(infoResquest) {
  const id = createId(sheetsRespuestaCreditos);
  const phoneClient = returnNullValue(infoResquest.clientPhone);
  const dateOfContact = returnNullValue(currentDate());
  const hourOfCall = returnNullValue(currentHour());
  const agent = returnNullValue(infoResquest.callAgentName);
  const clientName = returnNullValue(infoResquest.clientName)
  const clientLastName = returnNullValue(infoResquest.clientLastName)
  const commentsToEval = returnNullValue(infoResquest.commentsToEval)
  const clientDni = infoResquest.clientDni === "" ? "NULL" : infoResquest.clientDni

  sheetsRespuestaCreditos.appendRow([
    id,
    clientName,
    clientLastName,
    clientDni,
    phoneClient,
    dateOfContact,
    hourOfCall,
    agent,
    commentsToEval,
    "Creditos"
  ]);

  return "Added request"
}

// Enviar mensaje a Slack de solicitud de evaluacion

const url = ""

async function sendSlackMessage(info) {

  const params = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Solicitud de Evaluación Crediticia:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*:identification_card: Cliente:*\n\t • ${info.clientName} ${info.clientLastName === "NULL" ? "" : info.clientLastName} • Telefono: ${info.clientPhone} • DNI: ${info.clientDni === "" ? "Sin registro" : info.clientDni} • Codigo: ${info.clientCod === "" ? "Sin registro" : info.clientCod}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*:page_with_curl: Asesor y Comentarios:*\n\t • ${info.callAgentName} / ${info.slackUserName} - ${info.commentsToEval === "" ? "Sin registro" : info.commentsToEval}`
          }
        }
      ]
    })
  }

  const sendMsg = UrlFetchApp.fetch(url, params)
  let respCode = sendMsg.getResponseCode()
  console.log(respCode)
}

//
// Enviar mensaje a Slack
async function sendSlackMessageOfResult(info) {

  const params = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Resultado de la Evaluación Crediticia:"
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*:identification_card: Cliente:*\n\t • ${info.clientName} ${info.clientLastName === "NULL" ? "" : info.clientLastName} • Telefono: ${info.clientPhone} • DNI: ${info.clientDni === "" ? "Sin registro" : info.clientDni} • Codigo: ${info.clientCod === "" ? "Sin registro" : info.clientCod}`
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*:classical_building: Resultado:* Evaluador y Comentarios:*\n\t • ${info.creditos} - ${info.slackUserNameCredit} - ${info.commentsCredits === "" ? "Sin registro" : info.commentsCredits}`
          }
        }
      ]
    })
  }

  const sendMsg = UrlFetchApp.fetch(url, params)
  let respCode = sendMsg.getResponseCode()
  console.log(respCode)
}

let folderDrive

function folderDriveFn(urlID) {
  folder = DriveApp.getFolderById(urlID)
}

function uploadImages(form) {

  /*  const infoImg = {
     folderId: "1y-kx9PoRYRQNVM9kl0vRKXaGBEnK52i8",
     /* images: [
       
     ]
   } */

  //const file = folder.createFile(form.formFileMultiple)

  /* if (form.formFileMultiple.multiple) {
    // Loop fileInput.files
    for (const file of form.formFileMultiple) {
      // Perform action on one file
      const files = folder.createFile(form.formFileMultiple[file])
    }
    // Only one file available
  } else {
    const files = folder.createFile(form.formFileMultiple[file])
  } */

  const files = folderDrive.createFile(form.formFileMultiple)

  return files.getUrl()
}
