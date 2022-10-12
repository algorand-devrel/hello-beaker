Hello Beaker Example
--------------------

### Get it

```sh
git clone git@github.com:algorand-devrel/hello-beaker.git
cd hello-beaker
yarn #installs stuff
```

### Run Frontend

```sh
yarn run dev # starts the dev server
```

## Tweak the Contract

### Get Beaker

```sh
cd contracts
python3.10 -m venv .venv
source .venv/bin/activate
pip install beaker-pyteal
```

### Regenerate the Application Spec

```sh
python hello.py
# ... writes to `./artifacts`
```

### Rebuild the client

```sh
yarn run rebuild 
# ... generates the client in src/hellobeaker_client.ts from contracts/artifacts/HelloBeaker.json
```
