export default class Plugin extends Patch{
	name = "ESE"
	version = "22.03.06"
	author = "Bui"

	loadEseSongs(){
		var promises = []

		this.addEdits(
			new EditValue(assets, "categoriesDefault").load(() => assets.categories),
			new EditValue(assets, "categories_ese").load(() => [{"aliases":["jpop", "j-pop", "pops"],"id":1,"title":"Pop","title_lang":{"cn":"流行音乐","en":"Pop","ja":"J-POP","ko":"POP","tw":"流行音樂"},"songSkin":{"background":"#219fbb","bg_img":"bg_genre_0.png","border":["#7ec3d3","#0b6773"],"outline":"#005058","sort":1,"infoFill":"#004d68"}},{"aliases":null,"id":2,"title":"Anime","title_lang":{"cn":"卡通动画音乐","en":"Anime","ja":"アニメ","ko":"애니메이션","tw":"卡通動畫音樂"},"songSkin":{"background":"#ff9700","bg_img":"bg_genre_1.png","border":["#ffdb8c","#e75500"],"outline":"#9c4100","sort":2,"infoFill":"#9c4002"}},{"aliases":["ボーカロイド曲","ボーカロイド","vocaloid music","vocaloid"],"id":3,"title":"VOCALOID™ Music","title_lang":{"en":"VOCALOID™ Music","ja":"ボーカロイド™曲"},"songSkin":{"background":"#def2ef","bg_img":"bg_genre_2.png","border":["#f7fbff","#79919f"],"outline":"#5a6584","sort":3,"infoFill":"#546184"}},{"aliases":["kids", "children", "folk"],"id":4,"songSkin":{"background":"#ff4e8a","bg_img":"bg_genre_kids.png","border":["#ffc1da","#c6004e"],"infoFill":"#a20024","outline":"#c3005c","sort":4},"title":"Kids'","title_lang":{"en":"Kids'","ja":"どうよう"}},{"aliases":["バラエティー"],"id":5,"title":"Variety","title_lang":{"cn":"综合音乐","en":"Variety","ja":"バラエティ","ko":"버라이어티","tw":"綜合音樂"},"songSkin":{"background":"#8fd321","bg_img":"bg_genre_3.png","border":["#f7fbff","#587d0b"],"outline":"#374c00","sort":5,"infoFill":"#3c6800"}},{"aliases":["クラッシック","classic"],"id":6,"title":"Classical","title_lang":{"cn":"古典音乐","en":"Classical","ja":"クラシック","ko":"클래식","tw":"古典音樂"},"songSkin":{"background":"#d1a016","bg_img":"bg_genre_4.png","border":["#e7cf6b","#9a6b00"],"outline":"#734d00","sort":6,"infoFill":"#865800"}},{"aliases":["game", "gamemusic"],"id":7,"title":"Game Music","title_lang":{"cn":"游戏音乐","en":"Game Music","ja":"ゲームミュージック","ko":"게임","tw":"遊戲音樂"},"songSkin":{"background":"#9c72c0","bg_img":"bg_genre_5.png","border":["#bda2ce","#63407e"],"outline":"#4b1c74","sort":7,"infoFill":"#4f2886"}},{"aliases":["namco", "namcooriginal"],"id":8,"title":"NAMCO Original","title_lang":{"cn":"NAMCO原创音乐","en":"NAMCO Original","ja":"ナムコオリジナル","ko":"남코 오리지널","tw":"NAMCO原創音樂"},"songSkin":{"background":"#ff5716","bg_img":"bg_genre_6.png","border":["#ffa66b","#b53000"],"outline":"#941c00","sort":8,"infoFill":"#961e00"}},{"title":"default","songSkin":{"background":"#ececec","border":["#fbfbfb","#8b8b8b"],"outline":"#656565","infoFill":"#656565"}}])
		)

		var image = document.createElement("img")
		image.id = "bg_genre_kids.png"
		image.src = "https://s2.taiko.uk/assets_201202/img/bg_genre_kids.png"
		loader.assetsDiv.appendChild(image)
		assets.image["bg_genre_kids"] = image
		this.bg_genre_kids = image
		promises.push(pageEvents.load(image))
		
		var subs = [
			["⒑", "10"],
			["⒒", "11"],
			["⒓", "12.5"],
			["⒕", "14"],
			["Ⅼ", "LO"],
			["Ⅾ", "DY"],
			["⁉", "!?"],
			["⁈", "?!"],
			["‼", "!!"],
			["‽", "!!!"],
			["❢", "!!!!"],
			["❣", "!!!!!"],
			["℣", "vs"],
			["☄", "☆彡"]
		]

		promises.push(loader.ajax("https://s2.taiko.uk/ese_220228/musicinfo.json").then(songs => {
			songs = JSON.parse(songs)
			songs.forEach(song => {
				var directory = "https://s2.taiko.uk/ese_220228/" + song.id + "/"
				song.music = new RemoteFile(directory + "main.ogg")
				song.chart = new RemoteFile(directory + "main.tja")
				if(song.title === "Nesin Amatias"){
					song.preview = 0
					song.previewMusic = new RemoteFile("https://s2.taiko.uk/etc/preview_tor.ogg")
				}else if(song.title === "Shin Zombie"){
					song.preview = 0
					song.previewMusic = new RemoteFile("https://s2.taiko.uk/etc/preview_glyzmb.ogg")
				}else if(song.preview > 0){
					song.previewMusic = new RemoteFile(directory + "preview.ogg")
				}

				subs.forEach(sub => {
					song.title = song.title.replaceAll(sub[0], sub[1])
					if(song.subtitle) song.subtitle = song.subtitle.replaceAll(sub[0], sub[1])

					languageList.forEach(lang => {
						if(song.title_lang[lang]) song.title_lang[lang] = song.title_lang[lang].replaceAll(sub[0], sub[1])
						if(song.subtitle_lang[lang]) song.subtitle_lang[lang] = song.subtitle_lang[lang].replaceAll(sub[0], sub[1])
					})
				})
			})
			this.addEdits(
				new EditValue(assets, "songs_ese").load(() => songs)
			)
			this.log(songs.length + " songs loaded.")
		}))

		return promises
	}

	load(){
		var promises = this.loadEseSongs()

		this.addEdits(
			new EditValue(allStrings.ja, "ese").load(() => "エヴリ・ソング・エヴァー"),
			new EditValue(allStrings.en, "ese").load(() => "Every Song Ever"),
			new EditValue(allStrings.cn, "ese").load(() => "Every Song Ever"),
			new EditValue(allStrings.tw, "ese").load(() => "Every Song Ever"),
			new EditValue(allStrings.ko, "ese").load(() => "Every Song Ever"),

			new EditFunction(SongSelect.prototype, "init").load(str => {
				str = plugins.insertBefore(str,
				`if (!assets.customSongs) {
						this.songs.push({
						title: gameConfig.ese ? strings.customSongs.default : strings.ese,
						skin: this.songSkin.ese,
						action: "ese",
						category: strings.random
					})
				}
				`, `var showCustom = false`)
				str = plugins.insertBefore(str,
				`"ese": {
					sort: 0,
					background: "#FF6F63",
					border: ["#FFB2AB", "#A53D35"],
					outline: "#9C1F4F"
				},
				`,
				`"plugins": {`)

				str = plugins.insertAfter(str,
				`if(showCustom`, ` && !gameConfig.ese`)
				return str
			}),

			new EditFunction(SongSelect.prototype, "redraw").load(str => {
				str = plugins.strReplace(str,
				`this.songs[index].action !== "random"`,
				`!(this.songs[index].action === "random" || this.songs[index].action === "ese")`)
				str = plugins.strReplace(str,
				`&& this.songs[index].action !== "random"`,
				`&& !(this.songs[index].action === "random" || this.songs[index].action === "ese")`)
				str = plugins.strReplace(str,
				`&& currentSong.action !== "random",`,
				`&& !(currentSong.action === "random" || currentSong.action === "ese"),`)
				return str
			}),

			new EditFunction(SongSelect.prototype, "onsongsel").load(str => {
				str = plugins.insertAfter(str,
				`if("song" in response.value){`,
				`if(response.value.song === "ese" && response.value.player !== p2.player){
					this.playSound("se_don")
					this.clean()
					if (!gameConfig.ese) {
						assets.categories = assets.categories_ese
						assets.songs = assets.songs_ese
						gameConfig.ese = true
						localStorage.setItem('ese', 'true')
						setTimeout(() => {
							new SongSelect(true, false, this.touchEnabled)
						}, 500)
					} else {
						assets.categories = assets.categoriesDefault
						assets.songs = assets.songsDefault
						gameConfig.ese = false
						localStorage.setItem('ese', 'false')
						setTimeout(() => {
							new SongSelect(true, false, this.touchEnabled)
						}, 500)
					}
				}
				`)
				
				return str
			}),

			new EditFunction(SongSelect.prototype, "toSelectDifficulty").load(str => {
				str = plugins.strReplace(str,
				`&& currentSong.action !== "random")`,
				`&& !(currentSong.action === "random" || currentSong.action === "ese"))`)

				str = plugins.insertAfter(str,
				`var currentSong = this.songs[this.selectedSong]`,
				`
				if(p2.session && !fromP2 && currentSong.action === "ese"){
					p2.send("songsel", {
						song: "ese",
						selected: true
					})
					setTimeout(() => {
						p2.send("songsel", {
							song: 0,
							selected: false
						})
					}, 200)
				}
				`)

				str = plugins.insertAfter(str,
				`this.toSettings()`,
				`}else if(currentSong.action === "ese"){
					this.playSound("se_don")
					this.clean()
					if (!gameConfig.ese) {
						assets.categories = assets.categories_ese
						assets.songs = assets.songs_ese
						gameConfig.ese = true
						localStorage.setItem('ese', 'true')
						setTimeout(() => {
							new SongSelect("ese", false, this.touchEnabled)
						}, 500)
					} else {
						assets.categories = assets.categoriesDefault
						assets.songs = assets.songsDefault
						gameConfig.ese = false
						localStorage.setItem('ese', 'false')
						setTimeout(() => {
							new SongSelect("ese", false, this.touchEnabled)
						}, 500)
					}
				`)
				return str
			}),

			new EditFunction(Session.prototype, "onEnd").load(str => {
				str = plugins.insertBefore(str,
				`if (p2.session && gameConfig.ese) {
					assets.categories = assets.categoriesDefault
					assets.songs = assets.songsDefault
					gameConfig.ese = false
					localStorage.setItem('ese', 'false')
				}
				`, `this.clean()`)
				return str
			}),

			new EditFunction(SongSelect.prototype, "onusers").load(str => {
				str = plugins.strReplace(str, `idDiff.id |0`, `idDiff.id`)
				str = plugins.strReplace(str,
				`return song.id === id`, `return song.hash === id`)
				return str
			}),

			new EditFunction(LoadSong.prototype, "setupMultiplayer").load(str => {
				str = plugins.strReplace(str,
				`id: song.folder`, `id: song.hash`)
				return str
			}),

			new EditFunction(Titlescreen.prototype, "init").load(str => {
				str = plugins.insertAfter(str,
				`if(songId){`,
				`	var ese = false
					if (songId > 100000) {
						this.songId -= 100000
						ese = true
					}
					if(ese){
						assets.categories = assets.categories_ese
						assets.songs = assets.songs_ese
						gameConfig.ese = true
						localStorage.setItem('ese', 'true')
					} else {
						assets.categories = assets.categoriesDefault
						assets.songs = assets.songsDefault
						gameConfig.ese = false
						localStorage.setItem('ese', 'false')
					}

				`)

				return str
			}),

			new EditFunction(Titlescreen.prototype, "goNext").load(str => {
				str = plugins.insertBefore(str,
				`if(p2.session && p2.player === 2 && localStorage.getItem('ese') === 'true'){
					assets.categories = assets.categoriesDefault
					assets.songs = assets.songsDefault
					gameConfig.ese = false
					localStorage.setItem('ese', 'false')
				}
				`,
				`if(p2.session && !fromP2){`)

				str = plugins.insertBefore(str,
				`if (localStorage.getItem('ese') === 'true') {
					assets.categories = assets.categories_ese
					assets.songs = assets.songs_ese
					gameConfig.ese = true
				}
				`,
				'\n\t\t\t\t\tsetTimeout(() => {')

				return str
			}),

		)

		return Promise.all(promises)
	}

	unload(){
		loader.assetsDiv.removeChild(this.bg_genre_kids)
		delete this.bg_genre_kids
	}
}
