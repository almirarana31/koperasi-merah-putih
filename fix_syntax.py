import sys

def fix_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # We want to keep everything up to the END of the first MemberCreditDetail component definition
    # which is the second component in the file.
    
    # Let's find 'function MemberCreditDetail'
    start_tag = "function MemberCreditDetail"
    start_index = content.find(start_tag)
    
    if start_index != -1:
        # Find the next '  )\n}\n' which closes this component
        end_tag = "  )\n}\n"
        end_index = content.find(end_tag, start_index)
        
        if end_index != -1:
            fixed_content = content[:end_index + len(end_tag)]
            with open(file_path, 'w') as f:
                f.write(fixed_content)
            print(f"Fixed {file_path}")
        else:
            print(f"End tag not found after {start_tag}")
    else:
        print(f"Start tag {start_tag} not found")

if __name__ == "__main__":
    fix_file(sys.argv[1])
