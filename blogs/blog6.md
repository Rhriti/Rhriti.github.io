<h2 style="color: #245ab3;">When you mark visited in BFS matters</h2>
Date-10/09/2026
<p>
A short note on how <b>when</b> you mark a node visited in a simple BFS changes space usage.
</p>
<p>
The snippet on the left marks a node visited <b>before</b> adding it to the queue. The one on the right marks it visited <b>after</b> popping it out of the queue.
</p>

<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: flex-start; margin: 16px 0;">
  <div style="flex: 1 1 280px; min-width: 0;">
    <div style="font-weight: bold; color: #245ab3; margin-bottom: 6px;">Left — mark on discover</div>
    <pre style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 12px; overflow-x: auto; font-size: 13px; line-height: 1.4; margin: 0;"><code>def bfs1(grid, start, end):
    stack = [start]
    steps = 0
    visited = set()
    visited.add((start[0], start[1]))
    while stack:
        arr = []
        for ele in stack:
            if ele == end:
                return steps
            for dr, dc in [[1,0],[-1,0],[0,1],[0,-1]]:
                r, c = ele[0]+dr, ele[1]+dc
                if (r,c) not in visited and in_bounds:
                    visited.add((r, c))  # mark first
                    arr.append([r, c])
        stack = arr
        steps += 1</code></pre>
  </div>
  <div style="flex: 1 1 280px; min-width: 0;">
    <div style="font-weight: bold; color: #245ab3; margin-bottom: 6px;">Right — mark on process</div>
    <pre style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 12px; overflow-x: auto; font-size: 13px; line-height: 1.4; margin: 0;"><code>def bfs2(grid, start, end):
    stack = [start]
    steps = 0
    visited = set()
    while stack:
        arr = []
        for ele in stack:
            visited.add((ele[0], ele[1]))  # mark on pop
            if ele == end:
                return steps
            for dr, dc in [[1,0],[-1,0],[0,1],[0,-1]]:
                r, c = ele[0]+dr, ele[1]+dc
                if (r,c) not in visited and in_bounds:
                    arr.append([r, c])     # no mark here
        stack = arr
        steps += 1</code></pre>
  </div>
</div>

<p>
As we travel layer by layer, the queue on the right starts containing <b>duplicates</b>. Take a grid:
</p>
<pre style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 10px 14px; display: inline-block; font-size: 14px; margin: 4px 0 12px;">[[S, A, B],
 [C, M, D],
 [F, G, E]]</pre>
<p>
Start at the top-left cell <b>S</b>. On the left we already mark S visited up front; on the right we mark S when we pop it.
</p>
<p>
<b>Layer 2:</b> On the left we mark children visited, then append them to the queue. On the right we append children without marking them visited yet.
</p>
<p>
<b>Layer 3:</b> We pop <b>C</b> and <b>A</b>. On the left we append <b>F, M, B</b> — and even though M is a child of both C and A, it is added only once, because we mark it visited before enqueue. On the right, after popping C we append F, M; then after popping A we append M, B again. M lands in the queue twice because we only mark after popping.
</p>
<p>
Same shortest path. Worse space on the right when many parents share a child in one layer.
</p>
<p style="margin-top: 16px;">
  <video controls style="max-width: 100%; height: auto; border: 1px solid #ccc; border-radius: 8px;" src="./images/BfsCompare.mp4">
    Your browser does not support the video tag.
  </video>
</p>
