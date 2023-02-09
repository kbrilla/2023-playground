import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';

declare class Highlight {
  constructor(...args);
  [x: string]: any;
}

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements AfterContentInit, OnDestroy {
  static rangesMap = new Map();
  static nextId = 0;
  id = HighlightDirective.nextId++;

  #highlight = '';
  @Input()
  set appHighlight(value: string) {
    this.#highlight = value;
    this.rangesRefresh();
  }

  mutationObserver = new MutationObserver(() => {
    this.rangesRefresh();
  });

  constructor(private elementRef: ElementRef) {}

  ngOnDestroy(): void {
    if (HighlightDirective.rangesMap.has(this.elementRef.nativeElement)) {
      HighlightDirective.rangesMap.delete(this.elementRef.nativeElement);
    }
    this.highlightRefresh();
  }

  ngAfterContentInit(): void {
    this.mutationObserver.observe(this.elementRef.nativeElement, {
      childList: true,
      subtree: true,
      characterDataOldValue: true,
    });
    this.rangesRefresh();
  }

  rangesRefresh() {
    setTimeout(() => {
      // console.log(this.elementRef.nativeElement, this.#highlight);
      const textNode = [...this.elementRef.nativeElement.childNodes].find(
        (child) => child.nodeType === Node.TEXT_NODE
      );
      const matches = [...textNode.textContent.matchAll(this.#highlight)];
      const ranges = [];
      for (let match of matches) {
        const range = new Range();
        range.setStart(textNode, match.index);
        range.setEnd(textNode, match.index + this.#highlight.length);
        ranges.push(range);
      }

      HighlightDirective.rangesMap.set(this.elementRef.nativeElement, ranges);

      // console.log(
      //   matches,
      //   HighlightDirective.rangesMap,
      //   Object.values(HighlightDirective.rangesMap)
      // );
      this.highlightRefresh();
    }, 0);
  }

  highlightRefresh() {
    const rangesToHighlight = [...HighlightDirective.rangesMap.values()].reduce(
      (prev, curr) => {
        return [...prev, ...curr];
      },
      [] as any[]
    );
    // console.log(rangesToHighlight);
    (CSS as any).highlights.set(
      'combobox-search-result',
      new Highlight(...rangesToHighlight)
    );
  }
}
