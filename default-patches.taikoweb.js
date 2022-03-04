export default class Plugin extends Patch{
	name = "Default patches"
	version = "22.03.03"
	description = "Opens the correct privacy file. Suppresses multiplayer errors. Adds an Application Form button to the tutorial and custom songs menu. Does not include the custom code in loader.js, which uses correct paths for api files."
	author = "Katie Frogs"
	
	load(){
		this.addEdits(
			new EditFunction(CustomSongs.prototype, "openPrivacy").load(str => {
				return plugins.insertAfter(str, 'open("privacy', `.txt`)
			}),
			new EditFunction(Account.prototype, "openPrivacy").load(str => {
				return plugins.insertAfter(str, 'open("privacy', `.txt`)
			}),
			new EditFunction(Tutorial.prototype, "init").load(str => {
				return plugins.insertAfter(str,
				'this.items = []', `
				
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
				pageEvents.add(this.formButton, ["click", "touchend"], this.linkButton.bind(this))`)
			}),
			new EditFunction(Tutorial.prototype, "setStrings").load(str => {
				return plugins.insertBefore(str,
				`this.getLink(this.formButton).innerText = "Application Form"
				this.formButton.setAttribute("alt", "Application Form")
				`, 'this.tutorialDiv.innerHTML = ""')
			}),
			new EditFunction(Tutorial.prototype, "clean").load(str => {
				return plugins.insertBefore(str,
				`pageEvents.remove(this.formButton, ["click", "touchend"])
				delete this.formButton
				`, 'assets.sounds["bgm_setsume"].stop()')
			}),
			new EditFunction(CustomSongs.prototype, "init").load(str => {
				return plugins.insertBefore(str,
				`var leftButtons = this.getElement("left-buttons")
				
				this.formButton = document.createElement("div")
				this.formButton.classList.add("taibtn", "stroke-sub", "link-btn")
				var link = document.createElement("a")
				link.target = "_blank"
				link.href = "https://forms.gle/8YtFaHdGksWcVqvB6"
				link.innerText = "Application Form"
				this.formButton.setAttribute("alt", "Application Form")
				this.formButton.appendChild(link)
				leftButtons.appendChild(this.formButton)
				this.items.push(this.formButton)
				pageEvents.add(this.formButton, ["click", "touchend"], this.linkButton.bind(this))
				`, 'this.endButton = this.getElement("view-end-button")')
			}),
			new EditValue(CustomSongs.prototype, "getLink").load(() => this.getLink),
			new EditValue(CustomSongs.prototype, "linkButton").load(() => this.linkButton),
			new EditFunction(CustomSongs.prototype, "keyPressed").load(str => {
				str = plugins.insertBefore(str,
				`}else if(selected === this.formButton){
					this.getLink(selected).click()
					assets.sounds["se_don"].play()
				`, '}else if(selected === this.linkPrivacy){')
				return plugins.strReplace(str,
				'this.items[this.selected] === this.linkPrivacy',
				`(this.items[this.selected] === this.linkPrivacy || this.items[this.selected] === this.formButton)`)
			}),
			new EditFunction(CustomSongs.prototype, "clean").load(str => {
				return plugins.insertBefore(str,
				`pageEvents.remove(this.formButton, ["click", "touchend"])
				delete this.formButton
				`, 'delete this.browse')
			})
		)
	}
	getLink(target){
		return target.getElementsByTagName("a")[0]
	}
	linkButton(event){
		if(event.target === event.currentTarget){
			this.getLink(event.currentTarget).click()
			assets.sounds["se_don"].play()
		}
	}
	start(){
		p2.disable()
	}
	stop(){
		p2.enable()
	}
}
