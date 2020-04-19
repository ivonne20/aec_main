var introVideo = document.getElementById("introVideo");

function playPause(){
  if(introVideo.paused)
    introVideo.play();
  else 
    introVideo.pause();
}