import mailTemplates from "../data/mailTemplates.json";
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

function createBooleanObject<T extends object>(obj: T): { [K in keyof T]: boolean } {
    const result = {} as { [K in keyof T]: boolean };
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = false;
        }
    }
    return result;
}

function setRandomPropertiesToTrue<T extends Record<string, boolean | undefined | null>>(
    obj: T,
    count: number
): T {
    const falseKeys: string[] = Object.keys(obj).filter(
        (key) => obj[key] === false
    );

    if (count > falseKeys.length) {
        count = falseKeys.length; // Ensure we don't try to set more than available
    }

    const keysToChange: string[] = [];
    const availableKeys = [...falseKeys]; // Create a copy

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        const selectedKey = availableKeys.splice(randomIndex, 1)[0];
        keysToChange.push(selectedKey);
    }

    // Type assertion to allow modification
    const mutableObj = obj as Record<string, boolean | undefined | null>;

    keysToChange.forEach((key) => {
        mutableObj[key] = true;
    });

    return obj;
}

export const generateMail = (redFlagResult: boolean = false, flagCount: number = 3, previousTemplateID: number | null = null) => {
    const templateCount: number = mailTemplates.length;
    let randomIndex: number = Math.floor(Math.random() * templateCount);
    if (previousTemplateID !== null && templateCount > 1) {
        while (randomIndex === previousTemplateID) {
            randomIndex = Math.floor(Math.random() * templateCount);
        }
    }

    const randomTemplate: MailTemplate = mailTemplates[randomIndex];
    let templateFlags: TemplateFlags = createBooleanObject(randomTemplate);

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

    if (redFlagResult) {
        templateFlags = setRandomPropertiesToTrue(templateFlags, flagCount);
    }

    const mailContent: MailContent = {
        templateID: randomTemplate.templateID,
        isRed: redFlagResult,
    };
    let randomContentIndex: number = 0;
    let contentArray: Array<MailObject> = [];

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