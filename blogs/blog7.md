<h2 style="color: #245ab3;">Why DFS memoization breaks in 8-way grid traversal</h2>
Date-13/09/2026
<p>
If you have spent time on grid problems, the template is familiar: start at the top-left, reach the bottom-right, and count unique paths or find a shortest path.
</p>
<p>
The usual tool is DFS plus memoization (top-down DP). Recurse, cache by <code>(row, col)</code>, and the solution runs in <b>O(N × M)</b>.
</p>
<p>
Then you hit something like <i>Shortest Path in a Binary Matrix</i>, where moves are allowed in all eight directions. The same DFS + memoization template returns a wrong answer or times out.
</p>
<p>
Here is why that cache is sound when you can only go right and down, and why it fails once movement is 8-way.
</p>

<h3 style="color: #245ab3;">Why memoization works for right/down</h3>
<p>
Memoization needs subproblems to be independent and static.
</p>
<p>
Restricting movement to right and down makes the grid a DAG. You cannot return to a cell you have already left, so you do not need a path-level <code>visited</code> set to stop infinite recursion.
</p>
<p>
Because there are no cycles, the shortest path from <code>(r, c)</code> to the destination is a fixed number. If the shortest path from <code>(1, 1)</code> to the end is 4, it is 4 no matter how you reached <code>(1, 1)</code>. Caching <code>memo[(1, 1)] = 4</code> is valid.
</p>

<h3 style="color: #245ab3;">The 8-directional trap</h3>
<p>
With up, down, left, right, and diagonals, cycles exist. Left then right then left can run forever. DFS needs a <code>visited</code> set on the current path.
</p>
<p>
That set is what breaks standard memoization. Cells on the current path behave like temporary walls. The shortest path from <code>(r, c)</code> to the end now depends on <i>which</i> cells were used to reach <code>(r, c)</code>.
</p>

<h3 style="color: #245ab3;">A poisoned cache</h3>
<p>
Take a 3×3 grid. <code>0</code> is open, <code>1</code> is a wall.
</p>
<pre style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 10px 14px; display: inline-block; font-size: 14px; line-height: 1.5; margin: 4px 0 12px;">[0, 1, 0]    S = (0,0) start
[0, 0, 1]    A = (1,0)  V = (1,1) center
[0, 0, 0]    M = (2,0)  B = (2,1)  E = (2,2) end</pre>
<p>
Assume DFS tries directions in this order: diagonal down-right, left, down, right.
</p>
<p>
<b>Phase 1 — a bad path writes a lie.</b> Start at S with <code>visited = {S}</code>. Diagonal down-right to V: <code>{S, V}</code>. Left to A: <code>{S, V, A}</code>. From A the search snakes A → M → B → E. On unwind it stores:
</p>
<pre style="background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; padding: 10px 14px; display: inline-block; font-size: 13px; line-height: 1.5; margin: 4px 0 12px;">memo[B] = 2    B → E
memo[M] = 3    M → B → E
memo[A] = 4    A → M → B → E</pre>
<p>
The true shortest path from A is A → V → E (3). A could not go to V because V was on the path. DFS cached the detour (4) as if it were absolute.
</p>
<p>
<b>Phase 2 — a good path trusts that lie.</b> Unwind back to S, drop V from <code>visited</code>. S tries down to A. The cache already has 4, so DFS returns immediately and never finds S → A → V → E.
</p>

<h3 style="color: #245ab3;">Takeaway</h3>
<p>
A correct memo key would have to include the board state: <code>memo[(r, c, visited)]</code>. On a 100×100 grid that state space is not usable.
</p>
<p>
For shortest path on an unweighted grid with cycles, drop DFS + memoization. BFS is the right tool: the first time it reaches a cell is the shortest path to that cell. No backtracking, no poisoned cache.
</p>
