export default class Plugin extends Patch{
	name = "Default patches"
	version = "22.02.23"
	description = "Opens the correct privacy file. Suppresses multiplayer errors. Adds an Application Form button to the tutorial. Does not include the custom code in loader.js, which uses correct paths for api files."
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
				this.items.push(this.formButton)`)
			}),
			new EditFunction(Tutorial.prototype, "setStrings").load(str => {
				return plugins.insertBefore(str,
				`this.getLink(this.formButton).innerText = "Application Form"
				this.formButton.setAttribute("alt", "Application Form")
				`, 'this.tutorialDiv.innerHTML = ""')
			}),
			new EditFunction(Tutorial.prototype, "clean").load(str => {
				return plugins.insertBefore(str,
				`pageEvents.remove(this.formButton, ["mousedown", "touchstart"])
				`, 'assets.sounds["bgm_setsume"].stop()')
			}),
			new EditFunction(SongSelect.prototype, "toOptions").load(str => {
				return plugins.strReplace(str, 'p2.socket &&', `!p2.socket ||`)
			})
		)
	}
	start(){
		p2.disable()
	}
	stop(){
		p2.enable()
	}
}
