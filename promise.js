class PromiseExample {
    constructor(executionFunction){
        this.promiseChain = [];
        this.handleError = () => {};

        this.onResolve = this.onResolve.bind(this);
        this.onReject = this.onReject.bind(this);
        //Takes resolve and reject which map to the internal onResolve() and onReject()
        //These are called when the fetch calls the resolve or reject
        executionFunction(this.onResolve, this.onReject);
    }
//In the native Promise in JavaScript, then() and catch() return a new Promise
    then(handleSuccess){
        this.promiseChain.push(handleSuccess);

        return this;
    }

    catch(handleError){
        this.handleError = handleError;

        return this;
    }

    onResolve(value){
        let storedValue = value;

        try{
            this.promiseChain.forEach((nextFunction) => {
                storedValue = nextFunction(storedValue);
            });
        } catch (error) {
            this.promiseChain = [];
            
            this.onReject(error);
        }
    }

    onReject(error){
        this.handleError(error);
    }
}

fakeApi = () => {
    const user = {
        username: 'Justin',
        favoriteNumber: 9,
        profile: 'github.com/jdav892'
    };

    //Simulate error probability with randomization
    if(Math.random() > .05){
        return {
            data: user,
            statusCode: 200,
        };
    }else{
        const error = {
            statusCode: 404,
            message: 'Could not find user',
            error: 'Not Found'
        };
        return error;
    }
};

//Assume this is AJAX library almost all newer ones return Promise Object

const makeApiCall = () => {
    return new PromiseExample((resolve, reject) => {
        //Use a timeout to simulate network delay for the response
        //This is the reason you use a promise, it waits for the API to respond
        //After received, executes in the `then()` blocks in order
        //If it executed immediately, there would be no data
        setTimeout(() => {
            const apiResponse = fakeApi();

            if(apiResponse.statusCode >= 400) {
                reject(apiResponse);
            }else{
                resolve(apiResponse.data);
            }
        }, 5000);
    });
};

makeApiCall()
    .then((user) => {
        console.log('In the first .then()');

        return user;
    })
    .then((user) => {
        console.log(`User ${user.username}'s favorite number is ${user.favoriteNumber}`);
        return user;
    })
    .then((user) => {
        console.log(`The previous .then() told you the favoriteNumber`)
        return user;
    })
    .then((user) => {
        console.log(`The profile URL is ${profile}`);
    })
    .then(() => {
        console.log('This is the last then()');
    })
    .catch((error) => {
        console.error(error.message);
    }) 