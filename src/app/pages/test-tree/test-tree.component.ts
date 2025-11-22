import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  checked?: boolean;
}

@Component({
    selector: 'app-test-tree',
    imports: [
        CommonModule,
        FormsModule,
        CdkTreeModule,
        MatTreeModule
    ],
    templateUrl: './test-tree.component.html',
    styleUrls: ['./test-tree.component.scss']
})
export class TestTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  private dataSubject = new BehaviorSubject<TreeNode[]>([]);

  ngOnInit() {
    const data: TreeNode[] = [
      {
        id: '1',
        label: 'Project Root',
        checked: false,
        children: [
          {
            id: '1-1',
            label: 'Frontend',
            checked: false,
            children: [
              { id: '1-1-1', label: 'Components', checked: false },
              { id: '1-1-2', label: 'Services', checked: false },
              { id: '1-1-3', label: 'Models', checked: false }
            ]
          },
          {
            id: '1-2',
            label: 'Backend',
            checked: false,
            children: [
              { id: '1-2-1', label: 'Controllers', checked: false },
              { id: '1-2-2', label: 'Database', checked: false }
            ]
          },
          {
            id: '1-3',
            label: 'DevOps',
            checked: false,
            children: [
              { id: '1-3-1', label: 'Docker', checked: false },
              { id: '1-3-2', label: 'Kubernetes', checked: false }
            ]
          }
        ]
      }
    ];
    this.dataSubject.next(data);
    this.dataSource.data = data;
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;

  onNodeToggle(node: TreeNode) {
    node.checked = !node.checked;
    if (node.children) {
      node.children.forEach(child => this.setChildrenCheckState(child, node.checked!));
    }
  }

  private setChildrenCheckState(node: TreeNode, checked: boolean) {
    node.checked = checked;
    if (node.children) {
      node.children.forEach(child => this.setChildrenCheckState(child, checked));
    }
  }

  expandAll() {
    this.treeControl.expandAll();
  }

  collapseAll() {
    this.treeControl.collapseAll();
  }

  getCheckedNodes(): TreeNode[] {
    return this.flattenTree(this.dataSource.data).filter(node => node.checked);
  }

  private flattenTree(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    nodes.forEach(node => {
      result.push(node);
      if (node.children) {
        result.push(...this.flattenTree(node.children));
      }
    });
    return result;
  }

  onShowChecked() {
    const checked = this.getCheckedNodes();
    console.log('Checked nodes:', checked);
    alert(`Checked nodes: ${checked.map(n => n.label).join(', ')}`);
  }
}
