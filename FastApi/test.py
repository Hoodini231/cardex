def word_break(target, pool):
    map = {}
    for string in pool:
        map[string] = True

    memo = {}

    def helper(target, output):
        if target == "":
            return output
        for string in map:
            if target.startswith(string):
                length = len(string)
                x = output.copy()
                x.append(string)
                return helper(target[length:], x)


    return helper(target, [])

def word_break_array(target, pool):
    # denote a empty string as a wild card...
    # we can do a for loop for every thing lor....
    used_words = {}
    memo = {}
    output_list = []
    def helper(target, output):
        if target == '':
            flag = False
            output_str = ''
            print("output", output)
            for x in output:
                if x not in used_words:
                    used_words[x] = True
                    output_str += x
                else:
                    flag = True
            print("output_str", output_str)
            return output_str if not flag else None
            
        elif target in memo:
            print("memo", target)
            return memo[target]
        lister = []

        for string in pool:
            if len(string) <= len(target):
                curr = 0
                valid_flag = True
                length = len(string)                                                                                                                                              
                for i in range(length):
                    if target[i] != string[i] and target[i] != '*':
                        valid_flag = False
                        break
                    curr += 1
                if valid_flag:
                    x = output.copy()
                    x.append(string)
                    m = helper(target[length:], x)
                    # lets say we return some form of list
                    lister.append(m)
                    # we still need to build...
        return lister
    x = helper(target, [])
    print("output_list", x)
    return x
    
            

            


# Example usage:
pool = ["help" , "key","mon", 'mow']
target = "helpkey"
t2 = '***k**'

# start + given + end
# start + given  
result = word_break_array(t2, pool)

if result:
    print("The target string can be segmented as:", result)
else:
    print("The target string cannot be segmented with the given pool of substrings.")
