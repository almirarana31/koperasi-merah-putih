import sys

file_path = 'components/dashboard/roles/petani-dashboard.tsx'
with open(file_path, 'r') as f:
    lines = f.readlines()

# Look for the last legitimate closing brace of the component
# The file should end with:
#     </div>
#   )
# }

new_lines = []
for line in lines:
    new_lines.append(line)
    if '</div>' in line and '  )' in lines[lines.index(line)+1] and '}' in lines[lines.index(line)+2]:
        new_lines.append(lines[lines.index(line)+1])
        new_lines.append(lines[lines.index(line)+2])
        break

with open(file_path, 'w') as f:
    f.writelines(new_lines)
