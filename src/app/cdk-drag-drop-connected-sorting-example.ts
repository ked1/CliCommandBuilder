import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'cdk-drag-drop-connected-sorting-example',
  templateUrl: 'cdk-drag-drop-connected-sorting-example.html',
  styleUrls: ['cdk-drag-drop-connected-sorting-example.css']
})
export class CdkDragDropConnectedSortingExample {
  constructor() {}

  tool: tool;
  commandIndex: number = null;
  optionIndex: number[] = [];

  terminalCommands: string[] = [];

  tools: tool[] = [
    {
      tool: 'git',
      commands: [
        {
          command: 'pull',
          description: 'download remote commits',
          options: [{ option: 'x', short: '', description: '', values: ['a', 'b', 'c'] }]
        }
      ]
    },
    {
      tool: 'ng',
      commands: [
        {
          command: 'serve',
          description: '',
          options: [
            { option: 'open', short: '', description: '', values: [] },
            { option: 'port', short: '', description: '', values: ['4200', '4201', '4202'] }
          ]
        }
      ]
    },
    {
      tool: 'npm',
      commands: [
        {
          command: '',
          description: '',
          options: [{ option: '', short: '', description: '', values: [] }]
        }
      ]
    }
  ];

  dropToken(event: CdkDragDrop<any[]>) {
    if (!event.previousContainer.data) {
      return;
    }
    const droppedItem: any = event.previousContainer.data[event.previousIndex];
    if (droppedItem.tool) {
      this.tool = droppedItem;
      this.commandIndex = null;
      this.optionIndex = [];
    }
    if (droppedItem.command) {
      console.log('dropped command');
      this.commandIndex = event.previousIndex;
    }
    if (droppedItem.option) {
      console.log('dropped option');
      this.optionIndex.push(event.previousIndex);
    }
  }

  dropCommand(event: CdkDragDrop<any[]>) {
    this.terminalCommands.push(
      `${this.tool.tool} ${this.tool.commands[this.commandIndex].command}`
    );
    this.tool = null;
    this.commandIndex = null;
    this.optionIndex = [];
  }
}

export class tool {
  tool: string;
  commands: command[];
}

export class command {
  command: string;
  description: string;
  short?: string;
  options: option[];
}

export class option {
  option: string;
  description: string;
  short?: string;
  values: string[];
}
