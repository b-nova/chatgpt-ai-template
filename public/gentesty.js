function gentesty_waitForElement(selector, condition = () => true, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const interval = 100; // Check every 100ms
        let elapsed = 0;

        const check = setInterval(() => {
            const elements = document.querySelectorAll(selector);
            const element = Array.from(elements).find(el => condition(el));
            if (element) {
                clearInterval(check);
                resolve(element);
            }
            elapsed += interval;
            if (elapsed >= timeout) {
                clearInterval(check);
                reject(new Error(`Element matching selector "${selector}" not found.`));
            }
        }, interval);
    });
}

function gentesty_setNativeValue(element, value) {
    return new Promise((resolve, reject) => {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter?.call(element, value);
        } else {
            valueSetter?.call(element, value);
        }

        element.dispatchEvent(new Event('input', {bubbles: true}));
        resolve();
    });
}

console.log("gentesty lib successfully loaded");

function gentesty_openBot() {
    return new Promise((resolve, reject) => {
        console.log("search for button 'Set API Key'");
        gentesty_waitForElement('button', el => el.textContent.trim() === 'Set API Key').then(button => {
            console.log("Button found:", button);
            button.click(); // Example action

            console.log("search for input with placeholder'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'");
            gentesty_waitForElement('input', el => el.placeholder === 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx').then(input => {
                console.log("Input field found:", input);
                const newValue = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
                gentesty_setNativeValue(input, newValue).then(() => {
                    console.log("search for button 'Save API Key'");
                    gentesty_waitForElement('button', el => el.textContent.trim() === 'Save API Key').then(button => {
                        console.log("Button found:", button);
                        button.focus();
                        button.click(); // Example action

                        console.log("search for div 'success'");
                        gentesty_waitForElement('div[data-status="success"]', el => el.getAttribute('data-status') === 'success').then(div => {
                            console.log("Div with data-status=success found:", div);

                            console.log("search for button 'close'");
                            gentesty_waitForElement('button', el => el.getAttribute('aria-label') === 'Close' && el.getAttribute('class').startsWith("chakra-modal")).then(button => {
                                console.log("Button with aria-label found:", button);
                                button.click(); // Example action
                                resolve();
                            }).catch(err => reject(err));
                        }).catch(err => reject(err));
                    }).catch(err => reject(err));
                });
            }).catch(err => reject(err));
        }).catch(err => reject(err));
    });

}

function gentesty_writeBot(message){
    return new Promise((resolve, reject) => {
        console.log("search for input 'Type your message here...'");
        gentesty_waitForElement('input', el => el.placeholder === 'Type your message here...').then(input => {
            gentesty_setNativeValue(input, message).then(() => {
                console.log("search for button 'Submit'");
                gentesty_waitForElement('button', el => el.textContent.trim() === 'Submit').then(button => {
                    console.log("Button Submit found:", button);
                    button.click();
                    resolve();
                });
            })

        });
    });
}

function gentesty_readBot(){
    return new Promise((resolve, reject) => {
        gentesty_waitForElement('input', el => el.placeholder === 'Type your message here...').then(input => {
            console.log("hallo ich bin ein Input")
            resolve("hallo");
        });
    });
}
