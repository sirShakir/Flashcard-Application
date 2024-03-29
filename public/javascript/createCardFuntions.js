//const Swal = require('sweetalert2')

var mic, recorder, soundFile;
let state = 0;

var blobID;

function setup() {
//console.log("setup was called")
  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);

  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();

}

function canvasPressed() {
  console.log("audio button was pressed")
  soundFile.play();
  // // ensure audio is enabled
  // userStartAudio();

  // // make sure user enabled the mic
  // if (state === 0 && mic.enabled) {

  //   // record to our p5.SoundFile
  //   recorder.record(soundFile);

  //   background(255,0,0);
  //   text('Recording!', width/2, height/2);
  //   state++;
  // }
  // else if (state === 1) {
  //   background(0,255,0);

  //   // stop recorder and
  //   // send result to soundFile
  //   recorder.stop();

  //   text('Done! Tap to play and download', width/2, height/2, width - 20);
  //   state++;
  // }

  // else if (state === 2) {
  //   soundFile.play(); // play the result!
  //   //save(soundFile, 'mySound.wav');
  //   state++;
  // }
}

function postCard(){
  let text1 = document.getElementById("languageSelector").value;
  let text2 = document.getElementById("newWord").value;
  let text3 = document.getElementById("englishWord").value;
  //let text4 = document.getElementById("cardType").value;
  let text5 = document.getElementById("deckname").value;

  let params = {
    language : text1,
    word: text2,
    english : text3,
    cardType : "n/a",
    deck : text5
  }

  $.post("/notecards/createCard",
  params,
  function(data, status){
      blobID = data._id;
      console.log(blobID);
      console.log("proceed with audio");
      fireAudioInstructions();
  });
  //console.log(params);
 
  // const Http = new XMLHttpRequest();
  // const url='/createCard';
  // Http.open("POST", url,true);
  // Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  // Http.send(JSON.stringify( params ));
  //  let only1 = 1;
  //  Http.onreadystatechange = (e) => {
  //   //console.log(Http.responseText)
  //   //if( only1 == 1){
  //     only1++;
  //     blobID = Http;
  //     console.log("proceed with audio");
  //     console.log(blobID);
  //     console.log( JSON.stringify( blobID.responseText) );
  //     //fireAudioInstructions();
  //   //}
  //  }

}

//functions is fired once respones arrives with blob#
function fireAudioInstructions(){
  fireAskIfWantAudio()
}

function fireAskIfWantAudio(){
  Swal.fire({
    title: '<strong>Recording</strong>',
    icon: 'info',
    html:
      'Do you want to record audio for flashcard ' ,
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText:
      '<i class="fa fa-thumbs-up"></i> Record',
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText:
      '<i class="fa fa-thumbs-down">Cancel</i>',
    cancelButtonAriaLabel: 'Thumbs down'
  })
  .then((result) => {
    if (result.value) {
      fireRecording();
    }else{
      fireResetForm();
    }
  })
}

function fireRecording(){
  
    userStartAudio();
    recorder.record(soundFile);
    let timerInterval
    Swal.fire({
      title: 'Recording now',
      html: 'I will close in <b></b> milliseconds.',
      timer: 8000,
      timerProgressBar: true,
      onBeforeOpen: () => {
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval)
      }
    }).then((result) => {
      recorder.stop();
      fireProcessingRecording();
      
    })
  
}

function fireProcessingRecording(){
      /* Read more about handling dismissals below */
      let timerInterval
      Swal.fire({
        title: 'Recording has stopped.. Processing',
        html: 'I will close in <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        onBeforeOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            const content = Swal.getContent()
            if (content) {
              const b = content.querySelector('b')
              if (b) {
                b.textContent = Swal.getTimerLeft()
              }
            }
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          playRecordingConfirm();
        }
      })
}

function playRecordingConfirm(){
  
    soundFile.play();
    Swal.fire({
      title: 'Listen and confirm',
      text: "Click cancel to redo recording",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        
        sendAudioBlob2Server();
        Swal.fire(
          'Flashcard and audio submited',
          'success'
        )
      }
      else{
        fireRecording();
      }
    })
  
}

function fireResetForm(){
  //going to reset form varibales all back to empty
  blobID = null;
  let text2 = document.getElementById("englishWord").value = "";
  let text3 = document.getElementById("newWord").value = "";
}

function updateCardWithAudioLink(){
  let params = {id: blobID}
  $.post("/notecards/appendAudioLink",
  params,
  function(data, status){
    console.log(data);
    fireResetForm();
  });
  // const Http = new XMLHttpRequest();
  // const url='/targetID';
  // Http.open("POST", url,true);
  // Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  // let params = { id: blobID};
  // Http.send(JSON.stringify( params ));
  //  let only1 = 1;
  //  Http.onreadystatechange = (e) => {
  //   //console.log(Http.responseText)
  //   if( only1 == 1){ only1++
  //      fireResetForm();
  //   }
  //  }

}

function sendAudioBlob2Server(){
  let soundBlob = soundFile.getBlob(); //get the recorded soundFile's blob & store it in a variable
  let formdata = new FormData() ; //create a from to of data to upload to the server
  formdata.append('soundBlob', soundBlob,  blobID + '.wav') ; // append the sound blob and the name of the file. third argument will show up on the server as req.file.originalname

  var httpRequestOptions = {
    method: 'POST',
    body: formdata , // with our form data packaged above
    headers: new Headers({
      'enctype': 'multipart/form-data' // the enctype is important to work with multer on the server
    })
  };
  // console.log(httpRequestOptions);
  // use p5 to make the POST request at our URL and with our options
  httpDo(
    "/notecards/uploadAudio",
    httpRequestOptions,
    (successStatusCode)=>{ //if we were successful...
      console.log("uploaded recording successfully: " + successStatusCode)
      updateCardWithAudioLink();
    },
    (error)=>{console.error(error);}
  )
 

  


}


