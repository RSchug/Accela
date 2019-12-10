function describeObject(obj2describe)
{
    //For Pageflow, use logDebug instead of aa.print (or aa.debug?  haven't tried it)

                logDebug("Object Class: " + obj2describe.getClass());
                
                logDebug("List Object Functions ...");
                //Print function list
                for (x in obj2describe) 
                                if (typeof(obj2describe[x]) == "function")
                                                aa.print("  " + x)

                logDebug("");
                logDebug("List Object Properties ...");
                                                
                //Print properties and values of the current function
                for (x in obj2describe) 
                                if (typeof(obj2describe[x]) != "function")
                                                logDebug("  " + x + " = " + obj2describe[x]);
                                                
}
