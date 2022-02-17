addEventListener("ready", () => {
	class Plugin extends Patch{
		name = "Default patches"
		version = "22.02.17"
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
				new EditValue(p2, "open").load(() => {
					return () => {}
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
				})
			)
		}
	}
	
	plugins.add(Plugin)?.start()
})

addEventListener("ready", () => {
	class Plugin extends Patch{
		name = "Offline Account"
		version = "22.02.16"
		description = "Allows setting a name and customizing Don without logging in"
		author = "Katie Frogs"
		
		load(){
			this.offlineAccount = {
				loggedIn: true,
				username: strings.defaultName,
				displayName: strings.defaultName,
				don: {
					body_fill: defaultDon.body_fill,
					face_fill: defaultDon.face_fill
				}
			}
			this.loadAccount()
			
			this.addEdits(
				new EditValue(gameConfig, "accounts").load(() => true),
				new EditValue(window, "account").load(() => {
					return this.offlineAccount
				}),
				new EditFunction(Account.prototype, "accountForm").load(str => {
					str = plugins.strReplace(str, 'this.items.push(this.logoutButton)', ``)
					return str + `
					this.accountPass.style.display = "none"
					this.accountDel.style.display = "none"
					this.logoutButton.style.display = "none"`
				}),
				new EditValue(Account.prototype, "request").load(() => this.request.bind(this)),
				new EditFunction(scoreStorage, "load").load(str => {
					return plugins.strReplace(str, 'account.loggedIn', `false`)
				}),
				new EditFunction(scoreStorage, "write").load(str => {
					return plugins.strReplace(str, 'account.loggedIn', `false`)
				}),
				new EditFunction(scoreStorage, "sendToServer").load(str => {
					return plugins.strReplace(str, 'account.loggedIn', `false`)
				})
			)
		}
		
		request(url, obj, get){
			switch(url){
				case "account/display_name":
					this.offlineAccount.username = obj.display_name
					this.offlineAccount.displayName = obj.display_name
					this.saveAccount()
					return Promise.resolve({
						display_name: this.offlineAccount.displayName
					})
				case "account/don":
					this.offlineAccount.don.body_fill = obj.body_fill
					this.offlineAccount.don.face_fill = obj.face_fill
					this.saveAccount()
					return Promise.resolve({
						don: this.offlineAccount.don
					})
				default:
					return Promise.reject({
						status: "error"
					})
			}
		}
		saveAccount(){
			localStorage.setItem("offlineAccount", JSON.stringify({
				name: this.offlineAccount.displayName,
				don: this.offlineAccount.don
			}))
		}
		loadAccount(){
			var account = localStorage.getItem("offlineAccount")
			if(account){
				try{
					account = JSON.parse(account)
				}catch(e){}
			}
			if(account){
				if(account.name){
					this.offlineAccount.username = account.name
					this.offlineAccount.displayName = account.name
				}
				if(account.don){
					if(account.don.body_fill){
						this.offlineAccount.don.body_fill = account.don.body_fill
					}
					if(account.don.face_fill){
						this.offlineAccount.don.face_fill = account.don.face_fill
					}
				}
			}
		}
		
		unload(){
			delete this.offlineAccount
		}
	}
	
	plugins.add(Plugin)?.start()
})
