from beaker import client, sandbox
from hello import HelloBeaker

def test_hello():
    # Create an Application client
    app_client = client.ApplicationClient(
        # Get sandbox algod client
        client=sandbox.get_algod_client(),
        # Instantiate app with the program version (default is MAX_TEAL_VERSION)
        app=HelloBeaker(version=6),
        # Get acct from sandbox and pass the signer
        signer=sandbox.get_accounts().pop().signer,
    )

    # Deploy the app on-chain
    app_id, app_addr, txid = app_client.create()
    print(
        f"""Deployed app in txid {txid}
        App ID: {app_id} 
        Address: {app_addr} 
    """
    )

    # Call the `hello` method
    result = app_client.call(HelloBeaker.hello, name="Beaker")
    assert result.return_value == "Hello, Beaker"