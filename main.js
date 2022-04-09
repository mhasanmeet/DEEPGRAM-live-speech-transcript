//import 'dotenv/config'

function validation(){
    if (!MediaRecorder.isTypeSupported('audio/webm'))
    return alert('Browser is not supported')
}
validation()


navigator.mediaDevices.getUserMedia({audio: true})
    .then ((stream) => {
        //console.log(stream)
        const mediaRecorder = new MediaRecorder(stream, {MimeType: 'audio/webm'})

        const socket = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', '443466b8-0027-4faf-a97c-9ed530f30a8a'])

        socket.onopen = () =>{
            mediaRecorder.addEventListener('dataavailable', event =>{
                socket.send(event.data)
            })
            mediaRecorder.start(250)
        }

        socket.onmessage = (message) => {
            const received = JSON.parse(message.data)
            const transcript = received.channel.alternatives[0].transcript
            console.log(transcript)
        }
        
    })