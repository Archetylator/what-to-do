// WIP 

<script>
  const localStorage = {}
  const remoteDB = new PouchDB('http://localhost:5984/userdb-617263686574656c6563796e61636a6140676d61696c2e636f6d')
  
  remoteDB.getSession(function (err, response) {
    if (!err) {
      localStorage.sync = response.userCtx.name ? true : false
    }
  })

  function logIn(host, name, password) {
    let db = new PouchDB(host)

    db.logIn(name, password).then(response => {
      if (response.name) {
        localStorage.sync = true
        localStorage.syncBoxActive = false
        localStorage.syncDetails.host = host
        localStorage.syncDetails.login = name
        passwordValue = ''
      }
    }).catch(e => {
      console.log(e)
    })
  }

  function logOut() {
    remoteDB.logOut().then(response => {
      localStorage.sync = false
      localStorage.syncDetails = {}
    })
  }
</script>

<p>
  {#if localStorage.sync}
    Is sync!
    {localStorage.syncDetails.host}
    <a href="" on:click={logOut}>Sign Out</a>
  {:else}
    <button on:click={() => { localStorage.syncBoxActive = !localStorage.syncBoxActive }}>Add a sync</button>
  {/if}

  <Dialog bind:active={localStorage.syncBoxActive}>
    <form>
      <input type="url" bind:value={localStorage.syncDetails.host} placeholder="Address" required />
      <input type="email" bind:value={localStorage.syncDetails.login} placeholder="Login" required />
      <input type="password" bind:value={passwordValue} placeholder="Password" required />
      <button on:click={() => {localStorage.syncBoxActive = false}}>Cancel</button>
      <button type="submit" on:click={() => { logIn(localStorage.syncDetails.host, localStorage.syncDetails.login, passwordValue) } }>OK</button>
    </form>
  </Dialog>

  <p>
    You can sync your database with a backend
  </p>
</p>