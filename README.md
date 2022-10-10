Hello Beaker Example
--------------------


```sh
git clone git@github.com:algorand-devrel/hello-beaker.git
cd hello-beaker
yarn #installs stuff
yarn start dev # starts the dev server
```

To modify the contract
```sh
cd contracts
python3.10 -m venv .venv
source .venv/bin/activate
pip install beaker-pyteal
# .. edit file
python hello.py # generates files in contracts/artifacts
cd ..
yarn run regen # Generates the client in src/hellobeaker_client.ts from contracts/artifacts/HelloBeaker.json
```