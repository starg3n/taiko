export default class Plugin extends Patch{
    name = "Song of the Day"
    version = "22.03.03"
    author = "Bui"

    loadSotd(){
        var promises = []
        var ts = Date.now()

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

        promises.push(loader.ajax("https://s2.taiko.uk/sotd/sotd.json?v="+ts).then(song => {
            song = JSON.parse(song)
            song.music = new RemoteFile("https://s2.taiko.uk/sotd/sotd.ogg?v="+ts)
            song.chart = new RemoteFile("https://s2.taiko.uk/sotd/sotd.tja?v="+ts)
            if(song.category=="VOCALOID Music"){
                song.category="VOCALOID™ Music"
            }
            subs.forEach(sub => {
                song.title = song.title.replaceAll(sub[0], sub[1])
                if(song.subtitle) song.subtitle = song.subtitle.replaceAll(sub[0], sub[1])

                languageList.forEach(lang => {
                    if(song.title_lang[lang]) song.title_lang[lang] = song.title_lang[lang].replaceAll(sub[0], sub[1])
                    if(song.subtitle_lang[lang]) song.subtitle_lang[lang] = song.subtitle_lang[lang].replaceAll(sub[0], sub[1])
                })
            })
            this.addEdits(
                new EditValue(assets, "sotd").load(() => song)
            )
            this.log("Loaded song: " + song.title)
        }))

        return promises
    }

    load(){
        var promises = this.loadSotd()

        this.addEdits(
            new EditValue(allStrings.ja, "sotd").load(() => "その日の曲"),
            new EditValue(allStrings.en, "sotd").load(() => "Song of the Day"),
            new EditValue(allStrings.cn, "sotd").load(() => "Song of the Day"),
            new EditValue(allStrings.tw, "sotd").load(() => "Song of the Day"),
            new EditValue(allStrings.ko, "sotd").load(() => "Song of the Day"),

            new EditFunction(SongSelect.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if (!assets.customSongs) {
                       var sotd = this.addSong(assets.sotd)
                       sotd.originalTitle = sotd.title
                       sotd.title = strings.sotd
                       sotd.skin = this.songSkin[assets.sotd.category]
                       sotd.category = sotd.category
                       sotd.canJump = false
                       this.songs.push(sotd)
                }
                `, `var showCustom = false`)
                str = plugins.insertBefore(str,
                `this.sotdSong = !assets.customSongs ? this.songs.find(song => song.id === assets.sotd.id) : {id:null}
                `,
                `this.songAsset = {`)

                return str
            }),

            new EditFunction(SongSelect.prototype, "redraw").load(str => {
                str = plugins.insertBefore(str,
                    `var selectedSong = this.songs[this.selectedSong]
                    if(selectedSong.id === this.sotdSong.id && selectedSong.title === strings.sotd){
                        selectedSong.title = selectedSong.originalTitle
                    }else if(selectedSong.id !== this.sotdSong.id && this.sotdSong.title !== strings.sotd){
                        this.sotdSong.title = strings.sotd
                    }
                    `,
                    `var ctx = this.ctx`)
                
                return str
            }),

            new EditFunction(SongSelect.prototype, "addSong").load(str => {
                str = plugins.strReplace(str,
                `assets.categories.find(cat => cat.id === song.category_id)`,
                `assets.sotd && song.id === assets.sotd.id ? assets.categories.find(cat => cat.title === song.category) : assets.categories.find(cat => cat.id === song.category_id)`)
                return str
            }),

            new EditFunction(View.prototype, "refresh").load(str => {
                str = plugins.strReplace(str,
                `assets.categories.find(cat=>cat.id == selectedSong.category_id)`,
                `gameConfig.ese && assets.sotd && selectedSong.folder === assets.sotd.id ? assets.categories.find(cat=>cat.id == selectedSong.category_id+(cat.id>=4?1:0)) : assets.categories.find(cat=>cat.id == selectedSong.category_id)`)
                return str
            }),

            new EditFunction(LoadSong.prototype, "run").load(str => {
                str = plugins.insertAfter(str,
                    `assets.sounds["v_start"].play()`,
                    `
                    if (assets.sotd && id == assets.sotd.id) {
                        songObj = assets.sotd
                    }`
                )
                return str
            
            }),

            new EditFunction(Controller.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if(assets.sotd.id == this.selectedSong.folder){
                    this.mainAsset = assets.sotd.sound
                    this.volume = assets.sotd.volume || 1
                }
                `,
                `assets.songs.forEach(song => {`)
                return str
            }),
            
            new EditFunction(Controller.prototype, "restartSong").load(str => {
                str = plugins.insertBefore(str,
                `if (assets.sotd && this.selectedSong.folder == assets.sotd.id) {
                    songObj = assets.sotd
                }
                `,
                `var promises = []`)
                return str
            }),

            new EditFunction(Game.prototype, "init").load(str => {
                str = plugins.insertBefore(str,
                `if(assets.sotd.id == selectedSong.folder){
                    this.mainAsset = assets.sotd.sound
                }
                `,
                `assets.songs.forEach(song => {`)
                return str
            }),

        )

        return Promise.all(promises)
    }
}
