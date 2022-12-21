let myShaders, shaders1, shaders2, audio, amp, fft, playbackState, playbackIcon, nextTrack, trackNumber, trackHighlight, visualizer;

let state = true
track = 1;

trackNumber = "audio/" + track + ".mp3"

// track info
const tracks = [{
    title: "Touch Touch Touch",
    artist: "AVA LOW"
  },
  {
    title: "HAL 9000",
    artist: "BASIXX"
  }, {
    title: "Light on Your Feet",
    artist: "RYAN JAMES CARR"
  }, {
    title: "Mama Funk",
    artist: "SPRING GANG"
  }, {
    title: "Papa Funk",
    artist: "SPRING GANG"
  },

];




function preload() {
  shaders1 = loadShader("shaders/vertex.vert", "shaders/fragment.frag");
  shaders2 = loadShader("shaders/vertex3.vert", "shaders/fragment2.frag");
  audio = loadSound(trackNumber);
}


function setup() {

  const canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  playbackIcon = select('.playback--state-js');
  let visual1 = select('.visual-1--js');
  let visual2 = select('.visual-2--js');
  myShaders = shaders1;

  visual1.mousePressed(() => {
    myShaders = shaders1;
    shader(myShaders);
  });
  visual2.mousePressed(() => {
    myShaders = shaders2;
    shader(myShaders);
  });

  shader(myShaders);
  console.log(myShaders)

  amp = new p5.Amplitude();
  fft = new p5.FFT();

  audio.pause();
  nextTrack = select('.playback--state-next');
  previousTrack = select('.playback--state-previous');
  playbackState = select('.playback--state-play');


  playbackState.mouseClicked(togglePlay);
  playbackIcon.addClass('fa-play');
  playbackIcon.addClass('initialPlay');
  nextTrack.mousePressed(nextTrackPlaying)
  previousTrack.mousePressed(previousTrackPlaying)
  playbackState.mouseClicked(togglePlay);
  console.log(trackNumber)

  updateTrackInfo()
}



function draw() {

  background(0);
  fft.analyze();
  const volume = amp.getLevel(1); // 0 - 1
  const freq = fft.getEnergy("highMid");

  // Spectral Centroid Frequency of the spectral centroid in Hz.
  // let freq = fft.getCentroid();
  // freq *= 0.001;

  const mapF = map(freq, 0, 50, 0, 20);
  const mapA = map(volume, 0, 0.2, 0, 0.3);

  myShaders.setUniform("uTime", frameCount);

  myShaders.setUniform("uFrequency", mapF);
  myShaders.setUniform("uAmp", mapA);

  // sphere(width / 4, 200, 200)
  sphere(width / 6, 200, 200);

}



function togglePlay() {
  if (playbackIcon.hasClass('initialPlay')) {
    audio.play();
    playbackIcon.removeClass('initialPlay');
    playbackIcon.removeClass('fa-play');
    playbackIcon.addClass('fa-pause');
  } else if (playbackIcon.hasClass('fa-pause')) {
    audio.pause();
    playbackIcon.removeClass('fa-pause');
    playbackIcon.addClass('fa-play');
  } else {
    audio.loop();
    playbackIcon.addClass('fa-pause');
    playbackIcon.removeClass('fa-play');
  }
}

function updateTrackInfo() {
  let trackTitleElement = select('.track-title');
  let trackArtistElement = select('.track-artist');
  let currentTrack = tracks[track - 1];

  trackTitleElement.html(currentTrack.title);
  trackArtistElement.html(currentTrack.artist);
}




function nextTrackPlaying() {

  track += 1;
  if (track > 5) {
    track = 1;
  }
  trackNumber = "audio/" + track + ".mp3";


  updateTrackInfo();


  // Select all track list items
  let allTracks = selectAll('.track-list__track');
  // Loop through the track list items
  for (let i = 0; i < allTracks.length; i++) {



    // If the current track list item has the same track number as the current track, add the highlight class
    if (i == 1 && allTracks[i].hasClass('track1')) {
      allTracks[i].removeClass('track-list__track-highlight');


    } else if (i == track - 1) {
      allTracks[i].addClass('track-list__track-highlight');
    }
    // If the current track list item has the highlight class, remove it
    else if (allTracks[i].hasClass('track-list__track-highlight')) {
      allTracks[i].removeClass('track-list__track-highlight');
    }
  }


  // Stop and unload the current audio file
  audio.stop();
  audio.disconnect();
  // Load the new audio file and play it
  audio = loadSound(trackNumber, playAudio);

  if (playbackIcon.hasClass('fa-play')) {
    audio.play();
  }

}

function previousTrackPlaying() {
  // Decrement track number and update trackNumber variable
  track -= 1;
  if (track < 1) {
    track = 5;
  }
  trackNumber = "audio/" + track + ".mp3";

  updateTrackInfo()

  // Select all track list items
  let allTracks = selectAll('.track-list__track');
  // Loop through the track list items
  for (let i = 0; i < allTracks.length; i++) {
    // If the current track list item has the same track number as the current track, add the highlight class
    if (i == track - 1) {
      allTracks[i].addClass('track-list__track-highlight');
    }
    // If the current track list item has the highlight class, remove it
    else if (allTracks[i].hasClass('track-list__track-highlight')) {
      allTracks[i].removeClass('track-list__track-highlight');
    }
  }


  // Stop and unload the current audio file
  audio.stop();
  audio.disconnect();
  // Load the new audio file and play it
  audio = loadSound(trackNumber, playAudio);


}


function playAudio() {
  // Check if the audio file has finished loading
  if (audio.isLoaded() && playbackIcon.hasClass('fa-pause')) {
    // Play the audio file
    audio.play();
  }

}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}