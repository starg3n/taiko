addEventListener("ready", () => {
	class Plugin extends Patch{
		name = "Default patches"
		version = "22.02.16"
		description = "Opens the correct privacy file. Suppresses multiplayer errors. Removes Random Song and an extra Back from the song select when no songs are loaded. Adds an Application Form button to the tutorial. Does not include the custom code in loader.js, which uses correct paths for api files."
		author = "Katie Frogs"
		
		load(){
			this.addEdits(
				new EditFunction(CustomSongs.prototype, "openPrivacy").load(str => {
					return plugins.insertAfter(str, 'open("privacy', `.txt`)
				}),
				new EditFunction(Account.prototype, "openPrivacy").load(str => {
					return plugins.insertAfter(str, 'open("privacy', `.txt`)
				}),
				new EditValue(p2, "open").load(() => {
					return () => {}
				}),
				new EditFunction(SongSelect.prototype, "init").load(str => {
					str = plugins.insertBefore(str,
					`if(assets.songs.length){
					`, 'this.songs.push({')
					return plugins.insertBefore(str,
					`}
					`, 'if(touchEnabled){')
				}),
				new EditFunction(Tutorial.prototype, "init").load(str => {
					str = plugins.insertBefore(str,
					`this.items = []
					
					var leftButtons = document.createElement("div")
					leftButtons.classList.add("left-buttons")
					
					this.formButton = document.createElement("div")
					this.formButton.classList.add("taibtn", "stroke-sub", "link-btn")
					var link = document.createElement("a")
					link.target = "_blank"
					link.href = "https://forms.gle/8YtFaHdGksWcVqvB6"
					this.formButton.appendChild(link)
					leftButtons.appendChild(this.formButton)
					this.endButton.parentNode.insertBefore(leftButtons, this.endButton)
					this.items.push(this.formButton)
					
					this.items.push(this.endButton)
					this.selected = this.items.length - 1
					
					`, 'this.setStrings()')
					return str.replace(/pageEvents\.add[\s\S]*(pageEvents\.send)/,
					`pageEvents.add(this.endButton, ["mousedown", "touchstart"], this.onEnd.bind(this))
					pageEvents.add(this.formButton, ["mousedown", "touchstart"], this.linkButton.bind(this))
					this.keyboard = new Keyboard({
						confirm: ["enter", "space", "don_l", "don_r"],
						previous: ["left", "up", "ka_l"],
						next: ["right", "down", "ka_r"],
						back: ["escape"]
					}, this.keyPressed.bind(this))
					this.gamepad = new Gamepad({
						"confirm": ["b", "ls", "rs"],
						"previous": ["u", "l", "lb", "lt", "lsu", "lsl"],
						"next": ["d", "r", "rb", "rt", "lsd", "lsr"],
						"back": ["start", "a"]
					}, this.keyPressed.bind(this))
					
					$1`)
				}),
				new EditValue(Tutorial.prototype, "keyPressed").load(() => this.keyPressed),
				new EditValue(Tutorial.prototype, "mod").load(() => this.mod),
				new EditValue(Tutorial.prototype, "onEnd").load(() => this.onEnd),
				new EditFunction(Tutorial.prototype, "setStrings").load(str => {
					return plugins.insertBefore(str,
					`this.getLink(this.formButton).innerText = "Application Form"
					this.formButton.setAttribute("alt", "Application Form")
					`, 'this.tutorialDiv.innerHTML = ""')
				}),
				new EditValue(Tutorial.prototype, "getLink").load(() => this.getLink),
				new EditValue(Tutorial.prototype, "linkButton").load(() => this.linkButton),
				new EditFunction(Tutorial.prototype, "clean").load(str => {
					return plugins.insertBefore(str,
					`pageEvents.remove(this.formButton, ["mousedown", "touchstart"])
					`, 'assets.sounds["bgm_setsume"].stop()')
				})
			)
		}
		
		keyPressed(pressed, name){
			if(!pressed){
				return
			}
			var selected = this.items[this.selected]
			if(name === "confirm"){
				if(selected === this.endButton){
					this.onEnd()
				}else{
					this.getLink(selected).click()
					pageEvents.send("about-link", selected)
					assets.sounds["se_don"].play()
				}
			}else if(name === "previous" || name === "next"){
				selected.classList.remove("selected")
				this.selected = this.mod(this.items.length, this.selected + (name === "next" ? 1 : -1))
				this.items[this.selected].classList.add("selected")
				assets.sounds["se_ka"].play()
			}else if(name === "back"){
				this.onEnd()
			}
		}
		mod(length, index){
			return ((index % length) + length) % length
		}
		onEnd(event){
			var touched = false
			if(event){
				if(event.type === "touchstart"){
					event.preventDefault()
					touched = true
				}else if(event.which !== 1){
					return
				}
			}
			this.clean()
			assets.sounds["se_don"].play()
			try{
				localStorage.setItem("tutorial", "true")
			}catch(e){}
			setTimeout(() => {
				new SongSelect(this.fromSongSel ? "tutorial" : false, false, touched, this.songId)
			}, 500)
		}
		getLink(target){
			return target.getElementsByTagName("a")[0]
		}
		linkButton(event){
			if(event.target === event.currentTarget && (event.type === "touchstart" || event.which === 1)){
				this.getLink(event.currentTarget).click()
				pageEvents.send("about-link", event.currentTarget)
				assets.sounds["se_don"].play()
			}
		}
	}
	
	plugins.add(Plugin)?.start()
})
