import mailTemplates from "../data/mailTemplates.json";

//Define types
export interface MailObject {
    content: string;
    red_flag: boolean;
}

interface MailTemplate {
    templateID: number;
    [key: string]: Array<MailObject> | number;
}

interface TemplateFlags {
    templateID?: boolean;
    [key: string]: boolean | undefined | null;
}


export interface MailContent {
    templateID: number;
    isRed: boolean;
    [key: string]: MailObject | number | boolean;
}

// Helper function to create a boolean object from another object. The returned object has the same keys, but all the property values are set to false.
function createBooleanObject<T extends object>(obj: T): { [K in keyof T]: boolean } {
    const result = {} as { [K in keyof T]: boolean };
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = false;
        }
    }
    return result;
}

// Helper function to set a given number of properties to true in an object, ignores properties that have a value other than false.
function setRandomPropertiesToTrue<T extends Record<string, boolean | undefined | null>>(
    obj: T,
    count: number
): T {
    const falseKeys: string[] = Object.keys(obj).filter(
        (key) => obj[key] === false
    );

    if (count > falseKeys.length) {
        count = falseKeys.length;
    }

    const keysToChange: string[] = [];
    const availableKeys = [...falseKeys];

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        const selectedKey = availableKeys.splice(randomIndex, 1)[0];
        keysToChange.push(selectedKey);
    }

    const mutableObj = obj as Record<string, boolean | undefined | null>;

    keysToChange.forEach((key) => {
        mutableObj[key] = true;
    });

    return obj;
}

// Function to generate random emails from templates defined in the .json file.
export const generateMail = (redFlagResult: boolean = false, flagCount: number = 3, previousTemplateID: number | null = null) => {
    // Let's get a random template.
    const templateCount: number = mailTemplates.length;
    let randomIndex: number = Math.floor(Math.random() * templateCount);
    // Let's try to avoid using the same template twice in a row.
    if (previousTemplateID !== null && templateCount > 1) {
        while (randomIndex === previousTemplateID) {
            randomIndex = Math.floor(Math.random() * templateCount);
        }
    }

    const randomTemplate: MailTemplate = mailTemplates[randomIndex];
    let templateFlags: TemplateFlags = createBooleanObject(randomTemplate);
    // templateFlags is used to determine which elements within the email should be "red flags" for the player to recognize malicious emails.
    // It does not need the ID and if there are any elements in the template that do not have a "red flag" variant we'll set the equivalent property to null to avoid trying to using a "red flag" variant there.
    for (const key in randomTemplate) {
        if (key === 'templateID') {
            delete templateFlags.templateID;
            continue;
        }
        if (Array.isArray(randomTemplate[key])) {
            if (!randomTemplate[key].some((item: any) => item.red_flag === true)) {
                templateFlags[key] = null;
            }
        }
    }

    // The redFlagResult argument determines whether the email is malicious or not. If it is malicious, we'll set a random number of properties to true in the templateFlags object. Those will be the "red flags" that the player needs to recognize.
    if (redFlagResult) {
        templateFlags = setRandomPropertiesToTrue(templateFlags, flagCount);
    }

    // Now we'll create the mail content object. This is the end result we'll return.
    const mailContent: MailContent = {
        templateID: randomTemplate.templateID,
        isRed: redFlagResult,
    };

    // Some helper variables to keep track of what we're doing.
    let randomContentIndex: number = 0;
    let contentArray: Array<MailObject> = [];

    // Now we'll loop through the templateFlags object and add the content to the mailContent object from the randomTemplate from the .json. We'll also check if the element is a "red flag" and if it is, we'll add the content from the "red flag" variant.
    for (const key in templateFlags) {
        if (templateFlags[key] === true) {
            if (Array.isArray(randomTemplate[key])) {
                contentArray = randomTemplate[key].filter((item: any) => item.red_flag === true);
                if (contentArray.length > 0) {
                    randomContentIndex = Math.floor(Math.random() * contentArray.length);
                    mailContent[key] = contentArray[randomContentIndex];
                }
            }
        } else {
            if (Array.isArray(randomTemplate[key])) {
                contentArray = randomTemplate[key].filter((item: any) => item.red_flag === false);
                if (contentArray.length > 0) {
                    randomContentIndex = Math.floor(Math.random() * contentArray.length);
                    mailContent[key] = contentArray[randomContentIndex];
                }
            }
        }
    }

    return mailContent;
}