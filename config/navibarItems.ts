type NavibarItem = [string, string] | [string, string, [string, string][]]

export default [
    ["Home", "/"],
    ["Speakers", "/speakers"],
    ["Program", "/program"],
    ["Registration", "/registration"],
    ["General Information", "/general_info"],
    ["Visa Information", "/visa"],
    ["Accommodation", "/accommodation"],
    ["Previous", "/previous", [
        ["2016", "/2016"],
        ["2023", "/2023"]
    ]]
] satisfies NavibarItem[]