<script>
    import { scaleLinear } from 'd3-scale';
    import { extent } from 'd3-array';
    import { line, curveStepAfter } from 'd3-shape';
    import flatten from 'lodash-es/flatten';

    let div;
    let width;
    $: height = width * 0.7;
    export let title = '';
    export let colors;
    export let field;
    export let values;

    const padding = {
        left: 30,
        right: 10,
        top: 20,
        bottom: 20
    };

    let xScale;
    $: {
        let xDomainMax = (Array.isArray(values) && Array.isArray(values[0]) && values[0].length) || 0;
        let xDomain = extent([0, xDomainMax])
        xScale = scaleLinear()
        .domain(xDomain)
        .range([padding.left, width - padding.right]);
    }

    let yDomain;
    $: {
        let min = Math.min(...flatten(values).map(v => v[field]));
        let max = Math.max(...flatten(values).map(v => v[field]));
        yDomain = extent([min, max]);
    }

    $: yScale = scaleLinear()
        .domain(yDomain)
        .nice()
        .rangeRound([height - padding.bottom, padding.top]);

    let vv = v => {
        if(isNaN(v)) return 0;
        return v;
    }

    $: lineGen = line().x((v,i) => vv(xScale(i))).y(yScale).curve(curveStepAfter);
    $: fieldValues = values.map(c => c.map(v => v[field]))
    $: paths = fieldValues.map(v => lineGen(v.concat(v[v.length-1])));
</script>

<style>
    h4 {
        font-size: 1rem;
    }
    svg {
        width: 100%;
    }
    path {
        fill: none;
        stroke-width: 2;
    }
    text {
        dominant-baseline: central;
        font-size: 13px;
        text-anchor: end;
    }
    line {
        fill: none;
        stroke: #ddd;
    }
    line.direct {
        stroke-width: 2;
        stroke: #ccc;
        stroke-dasharray: 6,4;
    }
</style>

<div bind:clientWidth={width} style="margin-top: 1em">
    <h4>{title}</h4>
    <svg height={height || 50}>
        {#if values.length}
            {#each yScale.ticks(6) as y}
            <text x="{padding.left-5}" y="{yScale(y)}">{y}</text>
            {/each}
            {#each paths as path, i}
            <path d={path} key={i} stroke={(colors[i] && colors[i].hex()) || "#000"} />
            {/each}
            <!-- {#each fieldValues as group, i}
                {#each group as v, j}
                <ellipse cx={xScale(j)} cy={yScale(v)} rx="5" ry="5" stroke={(colors[i] && colors[i].hex()) || "#000"} fill={(colors[i] && colors[i].hex()) || "#000"} opacity="0.9" />
                {/each}
            {/each} -->
        {/if}
    </svg>
</div>