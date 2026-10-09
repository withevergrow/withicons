import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, Directive, ElementRef, InjectionToken, Input, Renderer2, ViewEncapsulation, booleanAttribute, inject, isDevMode } from "@angular/core";
var WithAttrsDirective = class WithAttrsDirective {
	withAttrs = null;
	el = inject(ElementRef);
	renderer = inject(Renderer2);
	applied = [];
	ngOnChanges() {
		const next = this.withAttrs || {};
		const node = this.el.nativeElement;
		const keys = [];
		for (const key of Object.keys(next)) {
			const value = next[key];
			if (value === null || value === void 0 || value === false) continue;
			this.renderer.setAttribute(node, key, String(value));
			keys.push(key);
		}
		for (const key of this.applied) if (!keys.includes(key)) this.renderer.removeAttribute(node, key);
		this.applied = keys;
	}
	static ɵfac = i0.ɵɵngDeclareFactory({
		minVersion: "12.0.0",
		version: "22.2.1",
		ngImport: i0,
		type: WithAttrsDirective,
		deps: [],
		target: i0.ɵɵFactoryTarget.Directive
	});
	static ɵdir = i0.ɵɵngDeclareDirective({
		minVersion: "14.0.0",
		version: "22.2.1",
		type: WithAttrsDirective,
		isStandalone: true,
		selector: "[withAttrs]",
		inputs: { withAttrs: "withAttrs" },
		usesOnChanges: true,
		ngImport: i0
	});
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.1",
	ngImport: i0,
	type: WithAttrsDirective,
	decorators: [{
		type: Directive,
		args: [{
			selector: "[withAttrs]",
			standalone: true
		}]
	}],
	propDecorators: { withAttrs: [{ type: Input }] }
});
const WITH_ICONS = new InjectionToken("WITH_ICONS");
function isWithIconData(value) {
	const v = value;
	return !!v && typeof v === "object" && typeof v.name === "string" && typeof v.variant === "string" && Array.isArray(v.node) && !!v.style;
}
function collect(source, out) {
	if (isWithIconData(source)) out.push(source);
	else if (Array.isArray(source)) for (const s of source) collect(s, out);
	else if (source && typeof source === "object") {
		for (const v of Object.values(source)) if (isWithIconData(v)) out.push(v);
	}
	return out;
}
function provideWithIcons(...sources) {
	return {
		provide: WITH_ICONS,
		multi: true,
		useValue: collect(sources, [])
	};
}
const indexCache = /* @__PURE__ */ new WeakMap();
function lookupWithIcon(registry, name, variant) {
	if (!registry) return void 0;
	let index = indexCache.get(registry);
	if (!index) {
		index = /* @__PURE__ */ new Map();
		for (const set of registry) for (const icon of set) index.set(`${icon.variant}/${icon.name}`, icon);
		indexCache.set(registry, index);
	}
	return index.get(`${variant}/${name}`);
}
const warned = /* @__PURE__ */ new Set();
const GEOMETRY = [
	"cx",
	"cy",
	"r",
	"rx",
	"ry",
	"x",
	"y",
	"width",
	"height",
	"x1",
	"y1",
	"x2",
	"y2",
	"points"
];
const pathCache = /* @__PURE__ */ new WeakMap();
const gradCache = /* @__PURE__ */ new WeakMap();
let uidCounter = 0;
function shapeToD(tag, a) {
	const n = (k) => Number(a[k] ?? 0) || 0;
	switch (tag) {
		case "circle":
		case "ellipse": {
			const cx = n("cx"), cy = n("cy"), rx = tag === "circle" ? n("r") : n("rx"), ry = tag === "circle" ? n("r") : n("ry");
			return `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
		}
		case "line": return `M${n("x1")} ${n("y1")}L${n("x2")} ${n("y2")}`;
		case "polyline":
		case "polygon": {
			const v = String(a["points"] ?? "").trim().split(/[\s,]+/).map(Number);
			const pts = [];
			for (let i = 0; i + 1 < v.length; i += 2) pts.push(`${v[i]} ${v[i + 1]}`);
			return pts.length ? "M" + pts.join("L") + (tag === "polygon" ? "Z" : "") : null;
		}
		case "rect": {
			const x = n("x"), y = n("y"), w = n("width"), h = n("height");
			let rx = a["rx"] != null ? n("rx") : n("ry"), ry = a["ry"] != null ? n("ry") : rx;
			rx = Math.min(rx, w / 2);
			ry = Math.min(ry, h / 2);
			if (!rx || !ry) return `M${x} ${y}H${x + w}V${y + h}H${x}Z`;
			return `M${x + rx} ${y}H${x + w - rx}A${rx} ${ry} 0 0 1 ${x + w} ${y + ry}V${y + h - ry}A${rx} ${ry} 0 0 1 ${x + w - rx} ${y + h}H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + h - ry}V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`;
		}
	}
	return null;
}
function gradsOf(node) {
	let out = gradCache.get(node);
	if (!out) {
		const list = [];
		for (const [tag, , kids] of node) {
			if (tag !== "defs" || !kids) continue;
			for (const [t, a, stops] of kids) {
				if (t !== "linearGradient" && t !== "radialGradient") continue;
				list.push({
					radial: t === "radialGradient",
					attrs: a,
					stops: (stops || []).filter((x) => x[0] === "stop").map((x) => x[1])
				});
			}
		}
		gradCache.set(node, out = list);
	}
	return out;
}
function withSuffix(a, sfx) {
	let b = null;
	for (const k of Object.keys(a)) {
		const v = a[k];
		const w = k === "id" ? v + sfx : typeof v === "string" && v.indexOf("url(#") >= 0 ? v.replace(/url\(#([^)\s]+)\)/g, "url(#$1" + sfx + ")") : v;
		if (w !== v) {
			if (!b) b = { ...a };
			b[k] = w;
		}
	}
	return b || a;
}
function pathsOf(node) {
	let out = pathCache.get(node);
	if (!out) {
		const list = [];
		for (const [tag, attrs] of node) {
			if (tag === "defs") continue;
			if (tag === "path") {
				list.push(attrs);
				continue;
			}
			const d = shapeToD(tag, attrs);
			if (d === null) continue;
			const p = {};
			for (const k of Object.keys(attrs)) if (!GEOMETRY.includes(k)) p[k] = attrs[k];
			p["d"] = d;
			list.push(p);
		}
		pathCache.set(node, out = list);
	}
	return out;
}
var WithIconComponent = class WithIconComponent {
	name;
	variant;
	icon;
	size = 24;
	color = "currentColor";
	strokeWidth;
	absoluteStrokeWidth = false;
	title;
	ariaLabel;
	ariaLabelledby;
	registry = inject(WITH_ICONS, { optional: true });
	rootAttrs = {};
	paths = [];
	grads = [];
	uid = "-w" + ++uidCounter;
	found = false;
	ready = false;
	ngOnChanges() {
		this.update();
	}
	ngOnInit() {
		if (!this.ready) this.update();
	}
	update() {
		this.ready = true;
		const variant = this.variant || "line";
		const data = this.icon || (this.name ? lookupWithIcon(this.registry, this.name, variant) : void 0);
		if (!data && isDevMode()) {
			const key = this.name ? `${variant}/${this.name}` : "(none)";
			if (!warned.has(key)) {
				warned.add(key);
				console.warn(this.name ? `<with-icon>: icon "${this.name}" (${variant}) is not registered. Add provideWithIcons(...) to your providers, or pass [icon].` : "<with-icon>: set [icon] or name.");
			}
		}
		const style = data ? data.style : null;
		const size = this.size === null || this.size === void 0 || this.size === "" ? 24 : this.size;
		const color = this.color || "currentColor";
		const a = {
			xmlns: "http://www.w3.org/2000/svg",
			width: size,
			height: size,
			viewBox: "0 0 24 24"
		};
		if (style) {
			for (const k of Object.keys(style.root)) a[k] = style.root[k] === "currentColor" ? color : style.root[k];
			if (style.strokeWidth !== false) {
				const sw = this.strokeWidth;
				const w = sw === null || sw === void 0 || sw === "" || isNaN(Number(sw)) ? style.strokeWidth : Number(sw);
				const px = /^\s*\d*\.?\d+(px)?\s*$/.test(String(size)) ? parseFloat(String(size)) : 0;
				a["stroke-width"] = this.absoluteStrokeWidth && px > 0 ? Math.round(w * 24 / px * 1e3) / 1e3 : w;
			}
		}
		if (color !== "currentColor") a["color"] = color;
		a["class"] = `withi withi-${data ? data.name : this.name || "unknown"}`;
		if (this.ariaLabel) a["aria-label"] = this.ariaLabel;
		if (this.ariaLabelledby) a["aria-labelledby"] = this.ariaLabelledby;
		if (this.title || this.ariaLabel || this.ariaLabelledby) a["role"] = "img";
		else a["aria-hidden"] = "true";
		this.rootAttrs = a;
		const grads = data ? gradsOf(data.node) : [];
		const sfx = this.uid;
		this.grads = grads.length ? grads.map((g) => ({
			radial: g.radial,
			attrs: withSuffix(g.attrs, sfx),
			stops: g.stops
		})) : grads;
		this.paths = data ? grads.length ? pathsOf(data.node).map((p) => withSuffix(p, sfx)) : pathsOf(data.node) : [];
		this.found = !!data;
	}
	static ɵfac = i0.ɵɵngDeclareFactory({
		minVersion: "12.0.0",
		version: "22.2.1",
		ngImport: i0,
		type: WithIconComponent,
		deps: [],
		target: i0.ɵɵFactoryTarget.Component
	});
	static ɵcmp = i0.ɵɵngDeclareComponent({
		minVersion: "17.0.0",
		version: "22.2.1",
		type: WithIconComponent,
		isStandalone: true,
		selector: "with-icon",
		inputs: {
			name: "name",
			variant: "variant",
			icon: "icon",
			size: "size",
			color: "color",
			strokeWidth: "strokeWidth",
			absoluteStrokeWidth: [
				"absoluteStrokeWidth",
				"absoluteStrokeWidth",
				booleanAttribute
			],
			title: "title",
			ariaLabel: ["aria-label", "ariaLabel"],
			ariaLabelledby: ["aria-labelledby", "ariaLabelledby"]
		},
		host: {
			properties: {
				"attr.title": "null",
				"attr.aria-label": "null",
				"attr.aria-labelledby": "null"
			},
			classAttribute: "with-icon"
		},
		usesOnChanges: true,
		ngImport: i0,
		template: "@if (found) {<svg [withAttrs]=\"rootAttrs\">@if (title) {<svg:title>{{ title }}</svg:title>}@if (grads.length) {<svg:defs>@for (g of grads; track $index) {@if (g.radial) {<svg:radialGradient [withAttrs]=\"g.attrs\">@for (s of g.stops; track $index) {<svg:stop [withAttrs]=\"s\" />}</svg:radialGradient>}@else {<svg:linearGradient [withAttrs]=\"g.attrs\">@for (s of g.stops; track $index) {<svg:stop [withAttrs]=\"s\" />}</svg:linearGradient>}}</svg:defs>}@for (p of paths; track $index) {<svg:path [withAttrs]=\"p\" />}<ng-content /></svg>}",
		isInline: true,
		styles: ["with-icon{display:inline-flex}\n"],
		dependencies: [{
			kind: "directive",
			type: WithAttrsDirective,
			selector: "[withAttrs]",
			inputs: ["withAttrs"]
		}],
		changeDetection: i0.ChangeDetectionStrategy.OnPush,
		encapsulation: i0.ViewEncapsulation.None
	});
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.1",
	ngImport: i0,
	type: WithIconComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "with-icon",
			standalone: true,
			imports: [WithAttrsDirective],
			changeDetection: ChangeDetectionStrategy.OnPush,
			host: {
				class: "with-icon",
				"[attr.title]": "null",
				"[attr.aria-label]": "null",
				"[attr.aria-labelledby]": "null"
			},
			encapsulation: ViewEncapsulation.None,
			template: "@if (found) {<svg [withAttrs]=\"rootAttrs\">@if (title) {<svg:title>{{ title }}</svg:title>}@if (grads.length) {<svg:defs>@for (g of grads; track $index) {@if (g.radial) {<svg:radialGradient [withAttrs]=\"g.attrs\">@for (s of g.stops; track $index) {<svg:stop [withAttrs]=\"s\" />}</svg:radialGradient>}@else {<svg:linearGradient [withAttrs]=\"g.attrs\">@for (s of g.stops; track $index) {<svg:stop [withAttrs]=\"s\" />}</svg:linearGradient>}}</svg:defs>}@for (p of paths; track $index) {<svg:path [withAttrs]=\"p\" />}<ng-content /></svg>}",
			styles: ["with-icon{display:inline-flex}\n"]
		}]
	}],
	propDecorators: {
		name: [{ type: Input }],
		variant: [{ type: Input }],
		icon: [{ type: Input }],
		size: [{ type: Input }],
		color: [{ type: Input }],
		strokeWidth: [{ type: Input }],
		absoluteStrokeWidth: [{
			type: Input,
			args: [{ transform: booleanAttribute }]
		}],
		title: [{ type: Input }],
		ariaLabel: [{
			type: Input,
			args: ["aria-label"]
		}],
		ariaLabelledby: [{
			type: Input,
			args: ["aria-labelledby"]
		}]
	}
});
export { WITH_ICONS, WithAttrsDirective, WithIconComponent, isWithIconData, lookupWithIcon, provideWithIcons };

