/**
* @description
* Takes an Array<V>, and a grouping function,
* and returns a Map of the array grouped by the grouping function.
*
* @param list An array of type V.
* @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
*                  K is generally intended to be a property key of V.
*
* @returns Map of the array grouped by the grouping function.
*/
//export function groupBy<K, V>(list: Array<V>, keyGetter: (input: V) => K): Map<K, Array<V>> {
//    const map = new Map<K, Array<V>>();
function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
};

function tabularCliParser(cliString) {
    const sample = `
        Method                     | Caller Method
    ---------------------------|---------------------------
    Main                       | entry point
    Console.WriteLine         | Main
    Console.ReadLine          | Main
    Console.WriteLine         | Main
    Console.ReadLine          | Main
    ImgTool                    | Main
    string.IsNullOrEmpty       | Main
    string.Length              | Main
    string.Split               | Main
    Directory.GetFiles         | Main
    int.TryParse               | Main
    Console.ForegroundColor    | Main
    Console.WriteLine         | Main
    imgTool.ResizeAndSaveImage | Main
    Console.WriteLine         | Main
    Console.Read               | Main
    `;
    if (cliString && typeof cliString === "string") {
        sample = cliString;
    }

    const all_input_lines = sample.split("\n");
    let groupped = groupBy(all_input_lines, (s) => !s.trim());
    let head = {};
    for (let [isBlank, inputLine] of groupped) {
        const input_lines = Array.from(inputLine);
        if (isBlank) {
            continue;
        }
        let allTrimmedInputs = input_lines.map(x => x.split('|').map(y => y.trim()));

        const [keys, dashes] = allTrimmedInputs.slice(0, 2);
        let keysDecided = false;
        if ([...dashes.join("")].every((s) => s === "-")) {
            console.log("keys are:", keys);
            keysDecided = true;
        }

        if (keysDecided) {
            allTrimmedInputs.shift();//remove keys
            allTrimmedInputs.shift();//remove dashes
            let firstKey = allTrimmedInputs[0][1].replaceAll(" ", "_");
            let currentNode = null;//firstKey{}
            let prevNode = null;
            head = currentNode;
            for (let values of allTrimmedInputs) {
                //let keyValueArr = [keys, values];
                values.reverse();
                let caller = values[0],
                    called = values[1];
                if (called.includes("Console") || called.includes("int") || called.includes("string")) {
                    continue;
                }
                let callerObj = { name: caller, desc: "", dependsOn: [] },
                    calledObj = { name: called, desc: "", dependsOn: [] };
                if (!currentNode) {
                    currentNode = calledObj;
                }
                if (currentNode.name === callerObj.name) {//existing node

                    currentNode.dependsOn.push(calledObj);
                    //currentObj[key] = {desc: "", calls: [newObj]};
                    //currentObj = currentObj[key];
                } else {
                    callerObj.dependsOn.push(calledObj);
                    if (prevNode) {
                        prevNode.dependsOn.push(callerObj);
                    } else {
                        head = callerObj;
                        prevNode = head;
                    }

                }
            }
            console.log(head);
        }
        return head;
    }
    return head;
};

export default tabularCliParser;