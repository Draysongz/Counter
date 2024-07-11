import "@stdlib/deploy";


message Add{
    queryId: Int as uint64;
    amount: Int as uint32;
}

message Decrease{
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract Counter with Deployable {
    id: Int as uint32;
    counter : Int as uint32;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
    }

    get fun counter(): Int{
        return self.counter;
    }
    
    get fun id(): Int{
        return self.id;
    }

    receive(msg: Add){
        self.counter += msg.amount;
    }

    receive(msg: Decrease){
        self.counter -= msg.amount;
    }
}
