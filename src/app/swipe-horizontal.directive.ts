import { DestroyRef, Directive, ElementRef, inject, output } from '@angular/core';

@Directive({
  selector: '[appSwipeHorizontal]',
  host: {
    class: 'app-swipe-horizontal',
  },
})
export class SwipeHorizontalDirective {
  readonly swipeLeft = output<void>();
  readonly swipeRight = output<void>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private static readonly minDistancePx = 40;
  private static readonly directionLockPx = 12;

  private activePointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private horizontalLock = false;
  private trackingTouch = false;

  private readonly removeDocumentListeners: Array<() => void> = [];

  constructor() {
    const node = this.el.nativeElement;

    const onTouchStart = (event: TouchEvent) => this.onTouchStart(event);
    const onPointerDown = (event: PointerEvent) => this.onPointerDown(event);

    node.addEventListener('touchstart', onTouchStart, { passive: true });
    node.addEventListener('pointerdown', onPointerDown);

    this.destroyRef.onDestroy(() => {
      this.clearDocumentListeners();
      node.removeEventListener('touchstart', onTouchStart);
      node.removeEventListener('pointerdown', onPointerDown);
    });
  }

  private onTouchStart(event: TouchEvent): void {
    if (event.touches.length !== 1) {
      return;
    }
    this.trackingTouch = true;
    this.startGesture(event.touches[0].clientX, event.touches[0].clientY);
    this.clearDocumentListeners();

    const onTouchMove = (moveEvent: TouchEvent) => this.onTouchMove(moveEvent);
    const onTouchEnd = (endEvent: TouchEvent) => this.finishTouch(endEvent);

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchEnd, { passive: true });

    this.removeDocumentListeners.push(
      () => document.removeEventListener('touchmove', onTouchMove),
      () => document.removeEventListener('touchend', onTouchEnd),
      () => document.removeEventListener('touchcancel', onTouchEnd),
    );
  }

  private onTouchMove(event: TouchEvent): void {
    if (!this.trackingTouch || event.touches.length !== 1) {
      return;
    }
    const touch = event.touches[0];
    this.updateDirectionLock(touch.clientX, touch.clientY);
    if (this.horizontalLock) {
      event.preventDefault();
    }
  }

  private finishTouch(event: TouchEvent): void {
    if (!this.trackingTouch) {
      return;
    }
    this.trackingTouch = false;
    this.clearDocumentListeners();

    const touch = event.changedTouches[0];
    if (!touch) {
      return;
    }
    this.emitSwipe(touch.clientX - this.startX, touch.clientY - this.startY);
  }

  private onPointerDown(event: PointerEvent): void {
    if (this.trackingTouch) {
      return;
    }
    if (event.pointerType === 'touch') {
      return;
    }
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    this.activePointerId = event.pointerId;
    this.startGesture(event.clientX, event.clientY);
    this.el.nativeElement.setPointerCapture(event.pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== this.activePointerId) {
        return;
      }
      this.updateDirectionLock(moveEvent.clientX, moveEvent.clientY);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== this.activePointerId) {
        return;
      }
      this.activePointerId = null;
      this.el.nativeElement.releasePointerCapture(upEvent.pointerId);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerup', onPointerUp);
      node.removeEventListener('pointercancel', onPointerUp);
      this.emitSwipe(upEvent.clientX - this.startX, upEvent.clientY - this.startY);
    };

    const node = this.el.nativeElement;
    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerup', onPointerUp);
    node.addEventListener('pointercancel', onPointerUp);
  }

  private startGesture(x: number, y: number): void {
    this.startX = x;
    this.startY = y;
    this.horizontalLock = false;
  }

  private updateDirectionLock(x: number, y: number): void {
    if (this.horizontalLock) {
      return;
    }
    const dx = Math.abs(x - this.startX);
    const dy = Math.abs(y - this.startY);
    if (dx < SwipeHorizontalDirective.directionLockPx && dy < SwipeHorizontalDirective.directionLockPx) {
      return;
    }
    this.horizontalLock = dx > dy;
  }

  private emitSwipe(dx: number, dy: number): void {
    if (Math.abs(dx) < SwipeHorizontalDirective.minDistancePx) {
      return;
    }
    if (Math.abs(dx) <= Math.abs(dy)) {
      return;
    }
    if (dx < 0) {
      this.swipeLeft.emit();
    } else {
      this.swipeRight.emit();
    }
  }

  private clearDocumentListeners(): void {
    for (const remove of this.removeDocumentListeners) {
      remove();
    }
    this.removeDocumentListeners.length = 0;
  }
}
