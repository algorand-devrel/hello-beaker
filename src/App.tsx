import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import algosdk from 'algosdk'
import { HelloBeaker } from './hellobeaker_client'
import * as bkr from 'beaker-ts'

function App() {
  const [count, setCount] = useState(0)
  const [acct, setAccount] = useState<algosdk.Account|undefined>(undefined)
  const [appClient, setAppClient] = useState<HelloBeaker|undefined>(undefined)
  const [appId, setAppId] = useState<number|undefined>(undefined);

  useEffect(()=>{
    if(acct !== undefined) return
    bkr.sandbox.getAccounts().then((accts)=>{
      const acct = accts[0]
      setAccount({addr: acct.addr, sk: acct.privateKey} as algosdk.Account)

      setAppClient(new HelloBeaker({
        client: bkr.sandbox.getAlgodClient(),
        sender: acct.addr,
        signer: acct.signer,
      }))
    });
  })


  async function createApp() {
    if(appClient === undefined || acct === undefined) return;

    const [appId, , ] = await appClient?.create()

    setAppId(appId)
    setAppClient(new HelloBeaker({
      client: appClient.client,
      sender: appClient.sender,
      signer: appClient.signer,
      appId: appId,
    }))
  }

  async function greet(){
    if(appClient === undefined) return;

    const result = await appClient.hello({name:"ben"})
    alert(result.value)
  }

  const action = appId === undefined ?  <button onClick={createApp}>Create</button>:<button onClick={greet}>Greet</button>

  return (
    <div className="App">
      <div className="card">
        <h3>{acct?.addr}</h3>
        {action}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
