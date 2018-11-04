import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Options } from 'selenium-webdriver/firefox';

/**
 * @title Drag&Drop connected sorting
 */
@Component({
  selector: 'app-command-builder',
  templateUrl: 'command-builder.component.html',
  styleUrls: ['command-builder.component.css']
})
export class CommandBuilder {
  constructor() {}

  tool: tool;
  commandIndex: number = null;
  optionIndexes: number[] = [];

  remainingOptions: option[];

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
      this.optionIndexes = [];
    }
    if (droppedItem.command) {
      console.log('dropped command');
      this.commandIndex = event.previousIndex;
      this.remainingOptions = this.getRemainingOptions();
    }
    if (droppedItem.option) {
      console.log('dropped option');
      this.optionIndexes.push(this.translateDropIndex(event.previousIndex));
      this.remainingOptions = this.getRemainingOptions();
    }
  }

  private translateDropIndex(index: number): number {
    for (let i = 0; i < this.tool.commands[this.commandIndex].options.length; i++) {
      const option = this.tool.commands[this.commandIndex].options[i];
      if (option.option === this.remainingOptions[index].option) {
        return i;
      }
    }
  }

  dropCommand(event: CdkDragDrop<any[]>) {
    let options = '';
    this.optionIndexes.forEach(i => {
      let option = this.tool.commands[this.commandIndex].options[i];
      options += ' --' + option.option;
      if (option.currentValue) {
        options += '=' + option.currentValue;
      }
    });
    this.terminalCommands.push(
      `${this.tool.tool} ${this.tool.commands[this.commandIndex].command} ${options}`
    );
    this.tool = null;
    this.commandIndex = null;
    this.optionIndexes = [];
  }

  private getRemainingOptions(): option[] {
    let remainingOptions = [];
    for (let i = 0; i < this.tool.commands[this.commandIndex].options.length; i++) {
      if (this.optionIndexes.indexOf(i) === -1)
        remainingOptions.push(this.tool.commands[this.commandIndex].options[i]);
    }
    return remainingOptions;
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
  active?: boolean = false;
  currentValue?: string;
}
