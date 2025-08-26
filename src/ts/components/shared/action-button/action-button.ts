import { Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { ButtonAction } from '../../../common/interfaces';
import { PonyTownGame, actionButtons } from '../../../client/game';
import { drawAction } from '../../../client/buttonActions';
import { removeItem } from '../../../common/utils';

@Component({
	selector: 'action-button',
	template: '<button class="action-button" (click)="click()" [class.active]="active" [class.no-shadow]="!shadow" [title]="action && action.title || \'\'"><canvas #canvas width="29" height="29"></canvas><div class="shortcut">{{shortcut}}</div><div class="count" *ngIf="action && action.type === \'item\'">{{action.count}}</div><div class="cover"></div></button>',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'[class.empty]': '!editable && !action',
	},
})
export class ActionButton {
	@Input() action?: ButtonAction;
	@Input() editable = false;
	@Input() active = false;
	@Input() shadow = true;
	@Input() shortcut = '';
	@Output() use = new EventEmitter<ButtonAction>();
	@ViewChild('canvas', { static: true }) canvas!: ElementRef;
	dirty = true;
	private state: any = {};
	constructor(private game: PonyTownGame) {
	}
	ngOnInit() {
		actionButtons.push(this);
	}
	ngOnDestroy() {
		removeItem(actionButtons, this);
	}
	ngOnChanges() {
		this.dirty = true;
	}
	click() {
		if (this.action) {
			this.use.emit(this.action);
		}
	}
	draw() {
		drawAction(this.canvas.nativeElement, this.action, this.state, this.game);
		this.dirty = false;
	}
}
