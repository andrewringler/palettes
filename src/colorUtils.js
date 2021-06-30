import chroma from 'chroma-js';
import isEqual from 'lodash-es/isEqual';

export function generateDerivedColors(baseColor, colorRules) {
    let derivedColors = [baseColor];
    let lch = baseColor.lch()
    
    colorRules && colorRules.forEach(rule => {
        derivedColors.push(chroma(lch[0] * rule.l, lch[1] * rule.c, lch[2] * rule.h, 'lch'))
    })
    return derivedColors;
}

export let DECIMAL_PLACES = 4;
let NUMBER_MATCH = `[0-9]{1,3}(?:\.[0-9]{1,${DECIMAL_PLACES}})?`
export let lchPctRegex = new RegExp(`L(${NUMBER_MATCH})%C(${NUMBER_MATCH})%H(${NUMBER_MATCH})%`)
export let lchPctCompactRegex = new RegExp(`l(${NUMBER_MATCH})c(${NUMBER_MATCH})h(${NUMBER_MATCH})`)

export let removeTrailingZeros = s => {
    return s.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/(\d+)\.0000$/, '$1')
}

let pctS = v => {
    let f = parseFloat(v);
    if(isNaN(f)) {
        return "0"
    }
    return removeTrailingZeros((f * 100.0).toFixed(DECIMAL_PLACES).toString())
}
let pctToF = v => {
    let f = parseFloat(v);
    if(isNaN(f)) {
        return "0"
    }
    return removeTrailingZeros((f / 100.0).toFixed(DECIMAL_PLACES).toString())
}
export let colorModifierObjectToString = r => `L${pctS(r.l)}%C${pctS(r.c)}%H${pctS(r.h)}%`
export let colorModifierObjectToStringCompact = r => `l${pctS(r.l)}c${pctS(r.c)}h${pctS(r.h)}`

export let compactColorRulesString = colorRules => {
    if(colorRules.length) {
        let ruleSetStrings = colorRules.map(ruleSet => ruleSet.map(colorModifierObjectToStringCompact).join(','));
        let allRulesEqual = ruleSetStrings.reduce((acc, cur, idx, arr) => acc && (idx > 0 ? isEqual(cur, arr[idx-1]) : true), true)
        
        let finalRulesString = allRulesEqual ? ruleSetStrings[0] : ruleSetStrings.join(';');
        return finalRulesString;
    }
    return '';
}

export let compactColorRulesStringToColorRules = colorRulesString => {
    let rulesSetStrings = colorRulesString.split(';');
    return rulesSetStrings.map(ruleSetString => {
        let ruleSetArr = ruleSetString.split(',');
        return ruleSetArr.map(rule => {
            let matches = rule.match(lchPctCompactRegex);
            if(matches && matches.length === 4) {
                return { l: pctToF(matches[1]), c: pctToF(matches[2]), h: pctToF(matches[3]) };
            }
        });
    });
}