import algosdk from "algosdk";
import * as bkr from "beaker-ts";
export class HelloBeaker extends bkr.ApplicationClient {
    desc: string = "";
    override appSchema: bkr.Schema = { declared: {}, reserved: {} };
    override acctSchema: bkr.Schema = { declared: {}, reserved: {} };
    override approvalProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKaW50Y2Jsb2NrIDAgMQp0eG4gTnVtQXBwQXJncwppbnRjXzAgLy8gMAo9PQpibnogbWFpbl9sNAp0eG5hIEFwcGxpY2F0aW9uQXJncyAwCnB1c2hieXRlcyAweDAyYmVjZTExIC8vICJoZWxsbyhzdHJpbmcpc3RyaW5nIgo9PQpibnogbWFpbl9sMwplcnIKbWFpbl9sMzoKdHhuIE9uQ29tcGxldGlvbgppbnRjXzAgLy8gTm9PcAo9PQp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAohPQomJgphc3NlcnQKdHhuYSBBcHBsaWNhdGlvbkFyZ3MgMQpjYWxsc3ViIGhlbGxvXzEKc3RvcmUgMApwdXNoYnl0ZXMgMHgxNTFmN2M3NSAvLyAweDE1MWY3Yzc1CmxvYWQgMApjb25jYXQKbG9nCmludGNfMSAvLyAxCnJldHVybgptYWluX2w0Ogp0eG4gT25Db21wbGV0aW9uCmludGNfMCAvLyBOb09wCj09CmJueiBtYWluX2w2CmVycgptYWluX2w2Ogp0eG4gQXBwbGljYXRpb25JRAppbnRjXzAgLy8gMAo9PQphc3NlcnQKY2FsbHN1YiBjcmVhdGVfMAppbnRjXzEgLy8gMQpyZXR1cm4KCi8vIGNyZWF0ZQpjcmVhdGVfMDoKaW50Y18xIC8vIDEKcmV0dXJuCgovLyBoZWxsbwpoZWxsb18xOgpzdG9yZSAxCnB1c2hieXRlcyAweDQ4NjU2YzZjNmYyYzIwIC8vICJIZWxsbywgIgpsb2FkIDEKZXh0cmFjdCAyIDAKY29uY2F0CnN0b3JlIDIKbG9hZCAyCmxlbgppdG9iCmV4dHJhY3QgNiAwCmxvYWQgMgpjb25jYXQKc3RvcmUgMgpsb2FkIDIKcmV0c3Vi";
    override clearProgram: string = "I3ByYWdtYSB2ZXJzaW9uIDcKcHVzaGludCAwIC8vIDAKcmV0dXJu";
    override methods: algosdk.ABIMethod[] = [
        new algosdk.ABIMethod({ name: "hello", desc: "", args: [{ type: "string", name: "name", desc: "" }], returns: { type: "string", desc: "" } })
    ];
    async hello(args: {
        name: string;
    }, txnParams?: bkr.TransactionOverrides): Promise<bkr.ABIResult<string>> {
        const result = await this.execute(await this.compose.hello({ name: args.name }, txnParams));
        return new bkr.ABIResult<string>(result, result.returnValue as string);
    }
    compose = {
        hello: async (args: {
            name: string;
        }, txnParams?: bkr.TransactionOverrides, atc?: algosdk.AtomicTransactionComposer): Promise<algosdk.AtomicTransactionComposer> => {
            return this.addMethodCall(algosdk.getMethodByName(this.methods, "hello"), { name: args.name }, txnParams, atc);
        }
    };
}
