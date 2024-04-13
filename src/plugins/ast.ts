// Math Parse AST
// Powered by ChatGPT 4.0
// Modified by: skadiD <@skadiDD>
type Token = { type: 'n', value: number } | { type: 'o', value: '+' | '-' | '*' | '/' | '%' } | { type: 'p', value: '(' | ')' } | { type: 'v', value: string };

export const tokenize = (input: string): Token[] => {
    const regex = /({[^{}]*})|(\d+\.\d+)|(\d+)|[\[\]]|[\(\)]|([\%\+\-\*\/])/g;
    const tokens: Token[] = [];
    let match;
    while (match = regex.exec(input)) {
        const token = match[0];
        // console.log('[Calc] Token', token)
        if (/{[^{}]*}/.test(token)) {
            tokens.push({ type: 'v', value: token.replace(/[{}]/g, '') });
        } else if (/^\d+\.\d+$/.test(token)) {
            tokens.push({ type: 'n', value: token as any });
        } else if (/\d/.test(token)) {
            tokens.push({ type: 'n', value: Number(token) });
        } else if (/[\+\-\*\/\%]/.test(token)) {
            tokens.push({ type: 'o', value: token as any });
        } else if (/[\(\)]/.test(token)) {
            tokens.push({ type: 'p', value: token as any });
        }
    }
    return tokens;
}
function GetProp(props: any, args: any): any {
    // 循环遍历props，取得value值
    let obj = args;
    if (typeof props === 'string') return obj?.[props];
    for (const prop of props) {
        obj = obj?.[prop];
    }
    return obj;
}
function parse(tokens: Token[], args: any): any {
    let i = 0;
    function parseExpression(): any {
        let left = parseTerm();
        while (i < tokens.length && tokens[i].type === 'o' && (tokens[i].value === '+' || tokens[i].value === '-')) {
            const op = tokens[i].value;
            i++;
            const right = parseTerm();
            left = { type: 'e', o: op, left, right };
        }
        return left;
    }
    function getProp(props: any): any {
        return GetProp(props, args)
    }
    function parseTerm(): any {
        let left = parseFactor();
        while (i < tokens.length && tokens[i].type === 'o' && (tokens[i].value === '*' || tokens[i].value === '/' || tokens[i].value === '%')) {
            const op = tokens[i].value;
            i++;
            const right = parseFactor();
            left = { type: 't', o: op, left, right };
        }
        return left;
    }

    function parseFactor(): any {
        if (tokens[i].type === 'n') {
            return tokens[i++].value;
        } else if (tokens[i].type === 'v') {
            // console.log('[Calc]', tokens[i])
            let value = 0
            const props = (tokens[i++].value as string).split('.');
            if (props[0][0] === '%') {
                props[0] = props[0].slice(1);
                value = Math.floor((getProp(props) || 0) * 100)
            } else {
                value = getProp(props) || 0
            }
            // console.log('[Calc]', tokens[i - 1].value, value)
            return value;
        } else if (tokens[i].type === 'p' && tokens[i].value === '(') {
            i++;
            const value = parseExpression();
            if (tokens[i].type === 'p' && tokens[i].value === ')') {
                i++;
                return value;
            }
        }
        throw new Error('[Calc] Unexpected token ' + tokens[i].value);
    }

    return parseExpression();
}

export const evaluate = (ast: any): number => {
    function c(a: any, b: any, o: string): any {
        const A = evaluate(a);
        const B = evaluate(b);
        let result = 0;
        switch (o) {
            case '+': result = A + B; break;
            case '-': result = A - B; break;
            case '*': result = A * (B || 1); break;
            case '/': result = A / (B || 1); break;
            case '%': result = Math.floor(A / (B || 1)); break;
        }
        console.log('[Calc Detail]', A, o, B, '=', result)
        return result;
    }
    switch (ast.type) {
        case 'e': return c(ast.left, ast.right, ast.o);
        case 't': return c(ast.left, ast.right, ast.o);
        // case 'e': return ast.o === '+' ? evaluate(ast.left) + evaluate(ast.right) : evaluate(ast.left) - evaluate(ast.right);
        // case 't': return ast.o === '*' ? evaluate(ast.left) * evaluate(ast.right) : 
        //     ast.o === '%' ? Math.floor(evaluate(ast.left) / (evaluate(ast.right) || 1))  : evaluate(ast.left) / (evaluate(ast.right) || 1);
        default: return ast;
    }
}

export const calculate = (input: string, args: any = null): number => {
    input = input.replace(/NaN/g, '0').replace(/undefined/g, '0');
    console.log('[Calc]', input)
    const tokens = tokenize(input);
    console.log('[Calc]', tokens)
    const ast = parse(tokens, args);
    return evaluate(ast);
}

export const calculate_ = (tokens: Token[], args: any = null): number => {
    console.log('[Calc]', tokens)
    const ast = parse(tokens, args);
    return evaluate(ast);
}

export const calc2str = (input: string, args: any = null): [number, string] => {
    const tokens = tokenize(input);
    let result = '';
    console.log('[Calc]', JSON.stringify(args))
    for (const token of tokens) {
        switch (token.type) {
            case 'n':
                result += token.value;
                break;
            case 'o':
            case 'p':
                result += token.value;
                break;
            case 'v':
                const props = token.value.split('.');
                if (args == null) {
                    result += `{${token.value}}`;
                    break;
                }
                if (props[0]?.[0] === '%') props[0] = props[0].slice(1);
                result += `{${token.value}:${GetProp(props, args) || 'Nil'}}`;
                break;
        }
    }
    // result += ' = ' + calculate_(tokens, args);
    return [calculate_(tokens, args), result];
}
// export for testing
// @ts-ignore
window.calc = calculate;
// @ts-ignore
window.calc2str = calc2str;