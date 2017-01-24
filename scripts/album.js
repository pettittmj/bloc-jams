var setSong = function(songNumber) {
	if (currentSoundFile) {
			 currentSoundFile.stop();
	 }
	currentlyPlayingSongNumber = parseInt(songNumber);
	currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
	setVolume(currentVolume);
};
var setVolume = function(volume) {
	if (currentSoundFile) {
		  currentSoundFile.setVolume(volume);
	}
};

var getSongNumberCell = function(number){

	return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
	var template =

	'<tr class="album-view-song-item">'
	+'  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+'  <td class="song-item-title">' + songName + '</td>'
	+'  <td class="song-item-duration">' + songLength + '</td>'
	+'</tr>';
	var $row = $(template);

	var clickHandler = function() {

		if (currentlyPlayingSongNumber !== null) {
			  var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
			  currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
				currentlyPlayingCell.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== songNumber) {
			  setSong(songNumber);
			  currentSoundFile.play();
				$(this).html(pauseButtonTemplate);
				updatePlayerBarSong();
		} 
		else if (currentlyPlayingSongNumber === songNumber) {
			togglePlayFromPlayerBar();	
		}
	};
	var onHover = function(event) {
		var songNumberCell = $(this).find('.song-item-number');
		var songNumber = parseInt(songNumberCell.attr('data-song-number'));

		if (songNumber !== currentlyPlayingSongNumber) {
				songNumberCell.html(playButtonTemplate);
		}
	};

	var offHover = function(event) {
		var songNumberCell = $(this).find('.song-item-number');
		var songNumber = parseInt(songNumberCell.attr('data-song-number'));

		if (songNumber !== currentlyPlayingSongNumber) {
				songNumberCell.html(songNumber);
		}

	};
	
	$row.find('.song-item-number').click(clickHandler);
	$row.hover(onHover, offHover);	

	return $row;
};	

     
var setCurrentAlbum = function(album) {
	currentAlbum = album;
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');


	$albumTitle.text(album.title);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);

	$albumSongList.empty();

	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
};
var trackIndex = function(album, song) {
	  return album.songs.indexOf(song);
};

var goToSong = function(direction) {
	  var getLastSongNumber = function(index) {
			if (direction == "next") {
				return index == 0 ? currentAlbum.songs.length : index;
			}
      if(direction == "previous") {
				 return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
			}
		};
		var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

		currentSongIndex += direction === "next" ? 1 : -1;
	
			if (currentSongIndex < 0) {
					currentSongIndex = currentAlbum.songs.length - 1;
			}
			if (currentSongIndex >= currentAlbum.songs.length) {
					currentSongIndex = 0;
			}
	
	  setSong(currentSongIndex + 1);
	  currentSoundFile.play();
	  updatePlayerBarSong();
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
    playPause.html(playerBarPauseButton);
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
	  if (direction == "next") {
			var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
				 $nextSongNumberCell.html(pauseButtonTemplate);
		};
		if (direction == "previous") {
			var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
			 $previousSongNumberCell.html(pauseButtonTemplate);
		};
    $lastSongNumberCell.html(lastSongNumber);
};

var togglePlayFromPlayerBar = function() {
	if (currentSoundFile.isPaused()) {
		$(this).html(pauseButtonTemplate);
		playPause.html(playerBarPauseButton);
		currentSoundFile.play();
	} else {
		 $(this).html(playButtonTemplate);
		playPause.html(playerBarPlayButton);
		currentSoundFile.pause(); 
	}
				
};

var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);

	  playPause.html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>'
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var playPause =  $('.main-controls .play-pause');


$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
	  $previousButton.click(function(){
			goToSong("previous");
		});
    $nextButton.click(function(){
			goToSong("next");
		});
    playPause.click(togglePlayFromPlayerBar);	
});